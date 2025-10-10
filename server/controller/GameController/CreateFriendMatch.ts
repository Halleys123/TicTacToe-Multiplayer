import { Response } from 'express';
import catchAsync from '@utils/catchAsync.js';
import { RedisClientType } from '@redis/client';
import getRedisClient from '@services/redis/index.js';
import { personalRoomKey, userIdKey } from '@services/redis/redisKeys.js';
import sendResponse from '@utils/sendResponse.js';

const CreateFriendMatch = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id;
    const redisClient: RedisClientType = getRedisClient();

    const userInGame = await redisClient.hGet(userIdKey(userId), 'game_id');

    if (userInGame) {
      const response: IResponse = {
        data: null,
        status: 'error',
        statusCode: 400,
        message: 'You are already in a game please fortify that first',
        success: false,
      };
      return sendResponse(res, response);
    }

    const roomId = personalRoomKey(userId);
    const userInRoom = await redisClient.lPop(roomId);

    if (userInRoom == roomId) {
      const response: IResponse = {
        data: {
          roomId: userId,
        },
        message:
          'You are already in search room please send the room code instead to your friend',
        status: 'error',
        statusCode: 404,
        success: false,
      };
      sendResponse(res, response);
    }
    redisClient.lPush(roomId, userId);
    redisClient.expire(roomId, 600, 'NX');
  }
);

export default CreateFriendMatch;
