import { Types } from 'mongoose';
import { Request, Response } from 'express';
import catchAsync from '@utils/catchAsync.js';
import GameModel from '@models/GameModel.js';
import sendResponse from '@utils/sendResponse.js';
import AppError from '@utils/AppError.js';

const UserStats = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id as string | null;
  if (!userId) throw new AppError('User ID not found', 400, true);

  const uid = new Types.ObjectId(userId);

  const pipeline = [
    {
      $match: {
        $or: [{ player_one_id: uid }, { player_two_id: uid }],
      },
    },
    {
      $addFields: {
        result: {
          $switch: {
            branches: [
              { case: { $eq: ['$winner', uid] }, then: 'win' },
              {
                case: {
                  $and: [{ $ne: ['$winner', null] }, { $ne: ['$winner', uid] }],
                },
                then: 'loss',
              },
            ],
            default: 'tie',
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        wins: { $sum: { $cond: [{ $eq: ['$result', 'win'] }, 1, 0] } },
        losses: { $sum: { $cond: [{ $eq: ['$result', 'loss'] }, 1, 0] } },
        ties: { $sum: { $cond: [{ $eq: ['$result', 'tie'] }, 1, 0] } },
        total: { $sum: 1 },
      },
    },
    { $project: { _id: 0 } },
  ];

  const agg = await GameModel.aggregate(pipeline);
  const stats = agg[0] || { wins: 0, losses: 0, ties: 0, total: 0 };

  const response: IResponse = {
    data: stats,
    message: 'Data retrived successfully',
    success: true,
    statusCode: 200,
    status: 'success',
  };

  return sendResponse(res, response);
});

export default UserStats;
