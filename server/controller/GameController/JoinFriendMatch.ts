import catchAsync from '@utils/catchAsync.js';
import { Response } from 'express';
import sendResponse from '@utils/sendResponse.js';
import getRedisClient from '@services/redis/index.js';
import { gameIdKey } from '@services/redis/redisKeys.js';

const JoinFriendMatch = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const roomId: string | null = req.body.roomId;

    const response: IResponse = {
      data: null,
      success: true,
      status: 'success',
      message: 'Successfully joined the room',
      statusCode: 200,
    };

    if (!roomId) {
      response.success = false;
      response.status = 'fail';
      response.message = 'Room ID is required';
      response.statusCode = 400;
      return sendResponse(res, response);
    }

    const redisClient = getRedisClient();

    if (!(await redisClient.exists(roomId))) {
      response.success = false;
      response.status = 'fail';
      response.message = 'Room does not exist. Please check your room ID';
      response.statusCode = 404;
      return sendResponse(res, response);
    }

    const newGameId = crypto.randomUUID();

    await redisClient.lPush(roomId, req.user._id);

    const player1 = await redisClient.rPop(roomId);
    const player2 = await redisClient.rPop(roomId);

    if (!player1 || !player2) {
      response.success = false;
      response.status = 'fail';
      response.message = 'Not enough players in the room';
      response.statusCode = 400;
      return sendResponse(res, response);
    }

    await Promise.all([
      redisClient.hSet(gameIdKey(newGameId), 'current_turn', player1),
      redisClient.hSet(gameIdKey(newGameId), player1, 'O'),
      redisClient.hSet(gameIdKey(newGameId), player2, 'X'),
      redisClient.hSet(
        gameIdKey(newGameId),
        'game_board',
        JSON.stringify([
          ['', '', ''],
          ['', '', ''],
          ['', '', ''],
        ])
      ),
      redisClient.hSet(
        gameIdKey(newGameId),
        'last_move_time',
        Date.now().toString()
      ),
      redisClient.del(roomId),
    ]);

    const game = { ...(await redisClient.hGetAll(gameIdKey(newGameId))) };

    response.data = { game };

    sendResponse(res, response);
  }
);

export default JoinFriendMatch;
