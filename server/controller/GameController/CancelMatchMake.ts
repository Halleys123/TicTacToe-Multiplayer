import getRedisClient from '@services/redis/index.js';
import { matchQueueKey } from '@services/redis/redisKeys.js';
import catchAsync from '@utils/catchAsync.js';
import sendResponse from '@utils/sendResponse.js';
import { Request, Response } from 'express';
import { RedisClientType } from 'redis';

const redisRequest = `
-- KEYS[1] = match queue
-- ARGV[1] = user id

local removed_id = redis.call("LPOP", KEYS[1])

if removed_id == ARGV[1] then
    return {"REMOVED"}
end
redis.call("LPUSH", KEYS[1], removed_id)
return {"ALREADY_IN_GAME"}
`;

const CancelMatchMaking = catchAsync(async (req: Request, res: Response) => {
  const userId = String(req.user?._id);
  const response: IResponse = {
    data: null,
    message: 'You have been removed from queue',
    status: 'success',
    statusCode: 200,
    success: true,
  };
  if (!userId) {
    return sendResponse(res, response);
  }

  const redisClient: RedisClientType = getRedisClient();

  const reply = await redisClient.eval(redisRequest, {
    keys: [matchQueueKey()],
    arguments: [userId],
  });

  if (!reply || !Array.isArray(reply)) {
    response.success = false;
    response.status = 'fail';
    response.statusCode = 400;
    response.message = 'Invalid response from server';
    response.data = reply;

    return sendResponse(res, response);
  }

  if (reply[0] == 'ALREADY_IN_GAME') {
    response.success = false;
    response.status = 'fail';
    response.statusCode = 400;
    response.message = 'You are already in a game';
    response.data = reply;
  }
  return sendResponse(res, response);
});

export default CancelMatchMaking;
