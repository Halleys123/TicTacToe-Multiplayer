import catchAsync from '@utils/catchAsync.js';
import { Response } from 'express';
import sendResponse from '@utils/sendResponse.js';
import getRedisClient from '@services/redis/index.js';
import { gameIdKey, userIdKey } from '@services/redis/redisKeys.js';
import AppError from '@utils/AppError.js';
import getIO from '@services/sockets/index.js';
import UserModel from '@models/UserModel.js';

const luaScript = `
-- KEYS[1] = room id key
-- KEYS[2] = game id key

-- ARGV[1] = player who want to join id
-- ARGV[2] = time when player moved
-- ARGV[3] = generated game id key

local roomExists = redis.call("EXISTS", KEYS[1])
if(roomExists == 0) then
  return {"ROOM_DONT_EXISTS"}
end

-- if redis.call("LLEN", KEYS[1]) < 1 then
--   redis.call("DEL", KEYS[1])
--   return {"INVALID_OPERATION"}
-- end

local player1 = redis.call("LPOP", KEYS[1])
local player2 = ARGV[1]

if(player1 == player2) then
  redis.call("LPUSH", KEYS[1], player1)
  return {"DUPLICATE"}
end

-- create game room

redis.call("HSET", KEYS[2],
  player1, "X",
  player2, "O",
  "game_board", '[["", "", ""], ["", "", ""], ["", "", ""]]',
  "current_turn", player1,
  "last_move_time", ARGV[2]
)

local p1Key = "TICTACTOE::USERID::" .. player1
local p2Key = "TICTACTOE::USERID::" .. player2

redis.call("HSET", p1Key, "game_id", ARGV[3])
redis.call("HSET", p2Key, "game_id", ARGV[3])

return {"GAME_CREATED", player1, player2}
`;

const JoinFriendMatch = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const roomIdKey: string | null = req.body.roomIdKey;
    const userId: string | null = String(req.user._id);

    const response: IResponse = {
      data: null,
      success: true,
      status: 'success',
      message: 'Successfully joined the room',
      statusCode: 200,
    };

    if (!roomIdKey) {
      response.success = false;
      response.status = 'fail';
      response.message = 'Room ID is required';
      response.statusCode = 400;
      return sendResponse(res, response);
    }

    const redisClient = getRedisClient();
    const io = getIO();

    if (!io) {
      throw new AppError('IO not found', 500, true);
    }

    const gameId = crypto.randomUUID();
    const gameKey = gameIdKey(gameId);

    const result = await redisClient.eval(luaScript, {
      keys: [roomIdKey, gameKey],
      arguments: [userId, Date.now().toString(), gameId],
    });

    if (!result || !Array.isArray(result)) {
      throw new AppError('Internal server error', 400, true);
    }

    const tag = result[0];

    if (tag === 'ROOM_DONT_EXISTS') {
      response.success = false;
      response.status = 'fail';
      response.message = 'Room does not exist';
      response.statusCode = 404;
    } else if (tag === 'INVALID_OPERATION') {
      response.success = false;
      response.status = 'fail';
      response.message = 'Invalid operation. Room state is incorrect';
      response.statusCode = 500;
    } else if (tag === 'DUPLICATE') {
      response.success = false;
      response.status = 'fail';
      response.message = 'Cannot join your own room';
      response.statusCode = 400;
    } else if (tag === 'GAME_CREATED') {
      if (typeof result[1] == 'string' && typeof result[2] == 'string') {
        const p1 = result[1];
        const p2 = result[2];

        const p1SockId: string | null = await redisClient.hGet(
          userIdKey(p1),
          'socket_id'
        );
        const p2SockId: string | null = await redisClient.hGet(
          userIdKey(p2),
          'socket_id'
        );

        if (!p1SockId || !p2SockId) {
          throw new AppError('Player socket id not found', 500, true);
        }

        const p1Sock = io.sockets.sockets.get(p1SockId);
        const p2Sock = io.sockets.sockets.get(p2SockId);

        if (!p1Sock || !p2Sock) {
          throw new AppError('Player socket not connected', 400, true);
        }

        // Join both sockets to the game room
        await Promise.all([p1Sock.join(gameId), p2Sock.join(gameId)]);

        const game = { ...(await redisClient.hGetAll(gameKey)) };

        // Parse the game_board for the clients
        if (game.game_board) {
          game.game_board = JSON.parse(game.game_board);
        }

        const lastMoveTime = +((await redisClient.hGet(
          gameIdKey(gameId),
          'last_move_time'
        )) as string);

        const p1Message = {
          otherData: await UserModel.findById(p2).lean(),
          game: game,
          myTurn: true,
          gameId,
        };
        const p2Message = {
          otherData: await UserModel.findById(p1).lean(),
          game: game,
          myTurn: false, // p2 waits
          gameId,
        };

        p1Sock.emit('match_found', p1Message);
        p2Sock.emit('match_found', p2Message);

        io.to(gameId).emit('timer_update', {
          data: (Date.now() - lastMoveTime) / 1000,
          message: 'Timer updated',
          success: true,
        });

        response.data = { ...game, gameId };
        response.message = 'Successfully joined the room and created game';
      }
    } else {
      throw new AppError('Unexpected response from Redis', 500, true);
    }
    sendResponse(res, response);
  }
);

export default JoinFriendMatch;
