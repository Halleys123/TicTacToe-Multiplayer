import catchAsync from '@utils/catchAsync.js';
import { Response } from 'express';
import sendResponse from '@utils/sendResponse.js';
import getRedisClient from '@services/redis/index.js';
import { gameIdKey } from '@services/redis/redisKeys.js';
import AppError from '@utils/AppError.js';
import getIO from '@services/sockets/index.js';
import { stringify } from 'qs';

const luaScript = `
-- KEYS[1] = room id key

-- ARGV[1] = player who want to join id
-- ARGV[2] = time when player moved
-- ARGV[3] = generated game id key

local roomExists = redis.call("EXISTS", KEYS[1])
if(!playerId) then
  return {"ROOM_DONT_EXISTS"}
end

if redis.call("LLEN", KEYS[1]) != 1 then
  redis.call("DEL", KEYS[1])
  return {"INVALID_OPERATION"}
end

local player1 = redis.call("HPOP", KEYS[1])
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
      arguments: [req.user._id, Date.now().toString(), gameId],
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
      const game = { ...(await redisClient.hGetAll(gameKey)) };
      if (typeof result[1] == 'string' && typeof result[2] == 'string') {
        io.to(result[1]).emit('friend_found', game);
        io.to(result[2]).emit('friend_found', game);
        io.to(result[1]).emit('game_message', {
          message: 'Game found',
          data: game,
        });
        io.to(result[2]).emit('game_message', {
          message: 'Game found',
          data: game,
        });
      }
      response.data = { ...game, gameId };
      response.message = 'Successfully joined the room and created game';
    } else {
      throw new AppError('Unexpected response from Redis', 500, true);
    }
    sendResponse(res, response);
  }
);

export default JoinFriendMatch;
