import { Response } from 'express';
import { Types } from 'mongoose';
import catchAsync from '@utils/catchAsync.js';
import GameModel from '@models/GameModel.js';
import UserModel from '@models/UserModel.js';
import AppError from '@utils/AppError.js';

const PlayerDetails = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const playerId = req.params.playerId;

    if (!playerId || !Types.ObjectId.isValid(playerId)) {
      throw new AppError('Invalid player ID', 400, true);
    }

    const pid = new Types.ObjectId(playerId);

    // Get player info
    const player = await UserModel.findById(pid);
    if (!player) {
      throw new AppError('Player not found', 404, true);
    }

    // Get player stats
    const statsPipeline = [
      {
        $facet: {
          player_one_stats: [
            {
              $match: { player_one_id: pid },
            },
            {
              $group: {
                _id: null,
                wins: {
                  $sum: {
                    $cond: [{ $eq: ['$winner', pid] }, 1, 0],
                  },
                },
                losses: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $ne: ['$winner', null] },
                          { $ne: ['$winner', pid] },
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
              $match: { player_two_id: pid },
            },
            {
              $group: {
                _id: null,
                wins: {
                  $sum: {
                    $cond: [{ $eq: ['$winner', pid] }, 1, 0],
                  },
                },
                losses: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $ne: ['$winner', null] },
                          { $ne: ['$winner', pid] },
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
          _id: null,
          wins: { $sum: '$wins' },
          losses: { $sum: '$losses' },
          draws: { $sum: '$draws' },
          totalGames: { $sum: '$totalGames' },
        },
      },
    ];

    const statsResult = await GameModel.aggregate(statsPipeline);
    const stats = statsResult[0] || {
      wins: 0,
      losses: 0,
      draws: 0,
      totalGames: 0,
    };

    // Get recent matches (limit to 20) using aggregation
    const matchesPipeline = [
      {
        $match: {
          $or: [{ player_one_id: pid }, { player_two_id: pid }],
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: 'player_one_id',
          foreignField: '_id',
          as: 'player_one',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'player_two_id',
          foreignField: '_id',
          as: 'player_two',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'winner',
          foreignField: '_id',
          as: 'winner_info',
        },
      },
      {
        $unwind: { path: '$player_one', preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: '$player_two', preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: '$winner_info', preserveNullAndEmptyArrays: true },
      },
    ];

    const recentMatches = await GameModel.aggregate(matchesPipeline as any);

    // Format matches
    const formattedMatches = recentMatches.map((match: any) => {
      const isPlayerOne = match.player_one_id.toString() === playerId;
      const opponent = isPlayerOne ? match.player_two : match.player_one;
      const playerMove = isPlayerOne
        ? match.player_one_move
        : match.player_two_move;
      const opponentMove = isPlayerOne
        ? match.player_two_move
        : match.player_one_move;

      let result = 'draw';
      if (match.winner) {
        result = match.winner.toString() === playerId ? 'win' : 'loss';
      }

      return {
        gameId: match.game_id,
        opponent: opponent?.displayName || opponent?.username || 'Unknown',
        playerMove,
        opponentMove,
        result,
        finalBoard: match.final_board,
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        player: {
          id: player._id,
          username: player.displayName || player.username,
        },
        stats: {
          ...stats,
          winRatio: stats.totalGames > 0 ? stats.wins / stats.totalGames : 0,
        },
        recentMatches: formattedMatches,
      },
    });
  }
);

export default PlayerDetails;
