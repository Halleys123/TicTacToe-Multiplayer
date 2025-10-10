import { Response } from 'express';
import catchAsync from '@utils/catchAsync.js';
import GameModel from '@models/GameModel.js';
import UserModel from '@models/UserModel.js';
import AppError from '@utils/AppError.js';
import { Types } from 'mongoose';

const allowedSortBy = ['max-win', 'highest-win-ratio', 'lowest-win-ratio'];
const concatednatedAllowedSortBy = allowedSortBy.join(', ');

const Leaderboard = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const sortBy: string = req.body.sortBy || 'max-win';
    const pageNumber: number = Number(req.body.pageNumber) || 1;
    const limit = 50;
    const skip = (pageNumber - 1) * limit;

    if (!allowedSortBy.includes(sortBy)) {
      throw new AppError(
        `Invalid Sortby field, use ${concatednatedAllowedSortBy}`,
        400,
        true
      );
    }

    let sortStage: Record<string, number> = {};

    if (sortBy === 'max-win') {
      sortStage = { wins: -1 };
    } else if (sortBy === 'highest-win-ratio') {
      sortStage = { winRatio: -1 };
    } else if (sortBy === 'lowest-win-ratio') {
      sortStage = { winRatio: 1 };
    }

    const pipeline = [
      {
        $facet: {
          player_one_stats: [
            {
              $group: {
                _id: '$player_one_id',
                wins: {
                  $sum: {
                    $cond: [{ $eq: ['$winner', '$player_one_id'] }, 1, 0],
                  },
                },
                losses: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $ne: ['$winner', null] },
                          { $ne: ['$winner', '$player_one_id'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                draws: {
                  $sum: {
                    $cond: [{ $eq: ['$winner', null] }, 1, 0],
                  },
                },
                totalGames: { $sum: 1 },
              },
            },
          ],
          player_two_stats: [
            {
              $group: {
                _id: '$player_two_id',
                wins: {
                  $sum: {
                    $cond: [{ $eq: ['$winner', '$player_two_id'] }, 1, 0],
                  },
                },
                losses: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $ne: ['$winner', null] },
                          { $ne: ['$winner', '$player_two_id'] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
                draws: {
                  $sum: {
                    $cond: [{ $eq: ['$winner', null] }, 1, 0],
                  },
                },
                totalGames: { $sum: 1 },
              },
            },
          ],
        },
      },
      {
        $project: {
          combined: {
            $concatArrays: ['$player_one_stats', '$player_two_stats'],
          },
        },
      },
      { $unwind: '$combined' },
      { $replaceRoot: { newRoot: '$combined' } },
      {
        $group: {
          _id: '$_id',
          wins: { $sum: '$wins' },
          losses: { $sum: '$losses' },
          draws: { $sum: '$draws' },
          totalGames: { $sum: '$totalGames' },
        },
      },
      {
        $addFields: {
          winRatio: {
            $cond: [
              { $eq: ['$totalGames', 0] },
              0,
              { $divide: ['$wins', '$totalGames'] },
            ],
          },
        },
      },
      { $sort: sortStage },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'playerInfo',
        },
      },
      { $unwind: { path: '$playerInfo', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          playerId: '$_id',
          username: {
            $ifNull: ['$playerInfo.displayName', '$playerInfo.username'],
          },
          wins: 1,
          losses: 1,
          draws: 1,
          totalGames: 1,
          winRatio: 1,
          _id: 0,
        },
      },
    ];

    const result = await GameModel.aggregate(pipeline);

    res.status(200).json({
      status: 'success',
      data: result,
      pageNumber,
    });
  }
);

export default Leaderboard;
