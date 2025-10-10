import { Response } from 'express';
import catchAsync from '@utils/catchAsync.js';
import { RedisClientType } from '@redis/client';
import getRedisClient from '@services/redis/index.js';
import { personalRoomKey, userIdKey } from '@services/redis/redisKeys.js';
import sendResponse from '@utils/sendResponse.js';

const luaCreateFriendRoom = `
-- KEYS[1] = user id key
-- KEYS[2] = name of key for game id in user object
-- KEYS[3] = user room key

-- ARGV[1] = user id (not key)

local game_id = redis.call("HGET", KEYS[1], KEYS[2])
if(game_id) then
  return {"USER_ALREADY_IN_GAME"}
end

local roomExists = redis.call("EXISTS", KEYS[3]);
if(roomExists) then
  return {"ROOM_EXISTS"}
end

redis.call("HPUSH", KEYS[3], ARGV[1])
redis.call("EXPIRE", KEYS[3], 600)
return {"ROOM_CREATED"}
`;

const CreateFriendMatch = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const redisClient: RedisClientType = getRedisClient();

    const result = await redisClient.eval(luaCreateFriendRoom, {
      keys: [userIdKey(userId), 'game_id', personalRoomKey(userId)],
      arguments: [userId],
    });

    const response: IResponse = {
      data: null,
      status: 'fail',
      statusCode: 500,
      message: 'Internal server error, invalid reply from redis',
      success: false,
    };

    if (!result || !Array.isArray(result)) {
      return sendResponse(res, response);
    }

    const tag = result[0];

    if (tag == 'USER_ALREADY_IN_GAME') {
      response.statusCode = 400;
      response.message = 'User is already in a game';
      return sendResponse(res, response);
    } else if (tag == 'ROOM_EXISTS') {
      response.statusCode = 409;
      response.message = 'Room already exists';
      return sendResponse(res, response);
    } else if (tag == 'ROOM_CREATED') {
      response.status = 'success';
      response.statusCode = 201;
      response.message = 'Friend room created successfully';
      response.success = true;
      return sendResponse(res, response);
    } else {
      return sendResponse(res, response);
    }
  }
);

export default CreateFriendMatch;
