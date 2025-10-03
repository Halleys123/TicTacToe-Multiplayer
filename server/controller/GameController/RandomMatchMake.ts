import UserModel from '@models/UserModel.js';
import getRedisClient from '@services/redis/index.js';
import {
  gameIdKey,
  matchQueueKey,
  userIdKey,
} from '@services/redis/redisKeys.js';
import getIO from '@services/sockets/index.js';
import AppError from '@utils/AppError.js';
import catchAsync from '@utils/catchAsync.js';
import sendResponse from '@utils/sendResponse.js';
import { Request, Response } from 'express';
import { RedisClientType } from 'redis';

const addToQueue = `
-- KEYS[1] = queue key
-- KEYS[2] = game key
-- KEYS[3] = user Key

-- ARGV[1] = userId
-- ARGV[2] = game id
-- ARGV[3] = ttl seconds

-- Prevent addition if user already in other match
local game_id = redis.call("HGET", KEYS[3], "game_id")
if game_id then
  return {"ALREADY_IN_GAME", game_id}
end

-- Prevent duplicate user in queue
if redis.call("LPOS", KEYS[1], ARGV[1]) then
  return {"DUPLICATE"}
end

redis.call("RPUSH", KEYS[1], ARGV[1])

if redis.call("LLEN", KEYS[1]) >= 2 then
  local p1 = redis.call("LPOP", KEYS[1])
  local p2 = redis.call("LPOP", KEYS[1])

  if p1 == p2 then
    -- Extremely unlikely now, but revert & signal duplicate
    redis.call("LPUSH", KEYS[1], p2)
    return {"DUPLICATE"}
  end

  local p1Key = "TICTACTOE::USERID::" .. p1
  local p2Key = "TICTACTOE::USERID::" .. p2

  redis.call("HSET", p1Key, "game_id", ARGV[2])
  redis.call("HSET", p2Key, "game_id", ARGV[2])

  redis.call("HSET", KEYS[2],
    p1, "X",
    p2, "O",
    "game_board", '[["", "", ""], ["", "", ""], ["", "", ""]]',
    "current_turn", p1
  )

  redis.call("EXPIRE", KEYS[2], ARGV[3])
  local game = redis.call("HGETALL", KEYS[2])
  return {"MATCHED", p1, p2, game}
end

return {"WAITING"}
`;

const MATCH_TTL_SECONDS = 3600; // 1 hour

const RandomMatchMake = catchAsync(async (req: Request, res: Response) => {
  const userId: string =
    typeof req.user?._id === 'string'
      ? req.user?._id
      : (req.user?._id as any).toString();

  const redisClient: RedisClientType = getRedisClient();
  const io = getIO();
  const gameId: string = crypto.randomUUID();

  if (!io) {
    throw new AppError(
      'Unable to load sockets, Internal server error',
      500,
      true
    );
  }

  const response: IResponse = {
    data: null,
    message: 'Waiting for the other opponent',
    success: true,
    status: 'success',
    statusCode: 200,
  };

  const result = await redisClient.eval(addToQueue, {
    keys: [matchQueueKey(), gameIdKey(gameId), userIdKey(userId)],
    arguments: [userId, gameId, MATCH_TTL_SECONDS.toString()],
  });

  if (!result || !Array.isArray(result)) {
    throw new AppError('Internal Server error while matching', 500, true);
  }

  const tag = result[0];

  if (tag == 'ALREADY_IN_GAME') {
    const existingGameId = result[1];
    response.data = {
      ...(await redisClient.hGetAll(
        typeof existingGameId === 'string' ? existingGameId : ''
      )),
    };
    response.message =
      'You are in other game, either quit that or continue that game';
    response.success = false;
    response.status = 'error';
    response.statusCode = 400;

    sendResponse(res, response);
  }

  if (tag === 'WAITING') {
    return sendResponse(res, response);
  }

  if (tag === 'DUPLICATE') {
    response.message = 'Already in queue. Cancel or wait.';
    response.status = 'fail';
    response.statusCode = 400;
    response.success = false;
    return sendResponse(res, response);
  }

  if (tag === 'MATCHED') {
    const p1 = result[1] as string;
    const p2 = result[2] as string;

    const p1SocketId = await redisClient.hGet(userIdKey(p1), 'socket_id');
    const p2SocketId = await redisClient.hGet(userIdKey(p2), 'socket_id');

    if (!p1SocketId || !p2SocketId) {
      throw new AppError('Player socket id not found', 500, true);
    }

    const p1Sock = io.sockets.sockets.get(p1SocketId);
    const p2Sock = io.sockets.sockets.get(p2SocketId);

    if (!p1Sock || !p2Sock) {
      throw new AppError('Player socket not connected', 400, true);
    }

    const roomId: string | null = await redisClient.hGet(
      userIdKey(p1),
      'game_id'
    );

    if (!roomId) {
      response.message = 'Socket room lost';
      response.data = null;
      response.success = false;
      response.statusCode = 500;
      return sendResponse(res, response);
    }

    await Promise.all([p1Sock.join(roomId), p2Sock.join(roomId)]);

    const game = { ...(await redisClient.hGetAll(gameIdKey(gameId))) };

    // Parse the game_board for the clients
    if (game.game_board) {
      game.game_board = JSON.parse(game.game_board);
    }

    const p1Data = {
      otherData: await UserModel.findById(p2).lean(),
      game: game,
      myTurn: true, // p1 always starts first
    };

    const p2Data = {
      otherData: await UserModel.findById(p1).lean(),
      game: game,
      myTurn: false, // p2 waits
    };

    p1Sock.emit('match_found', p1Data);
    p2Sock.emit('match_found', p2Data);

    response.message = 'Match Found';
    response.data = {
      status: 'matched',
      myId: userId === p1 ? p1 : p2,
      otherId: userId === p1 ? p2 : p1,
      game,
    };
    return sendResponse(res, response);
  }
});

export default RandomMatchMake;
