import getRedisClient from '@services/redis/index.js';
import { userIdKey } from '@services/redis/redisKeys.js';
import GameModel from '@models/GameModel.js';
import { env } from '@utils/listEnv.js';
import { Server } from 'socket.io';

const TIMEOUT_DURATION: number = env.GAME_CONFIG_MOVE_DURATION;
const CHECK_INTERVAL = env.GAME_CONFIG_CHECK_INTERVAL;

let timeoutInterval: NodeJS.Timeout | null = null;

export function startGameTimeoutChecker(io: Server) {
  if (timeoutInterval) {
    console.log('[GameTimeout] Timeout checker already running');
    return;
  }

  console.log(
    `[GameTimeout] Starting timeout checker (checking every ${
      CHECK_INTERVAL / 1000
    }s for ${TIMEOUT_DURATION / 1000}s timeout)`
  );

  timeoutInterval = setInterval(async () => {
    await checkGameTimeouts(io);
  }, CHECK_INTERVAL);
}

export function stopGameTimeoutChecker() {
  if (timeoutInterval) {
    clearInterval(timeoutInterval);
    timeoutInterval = null;
    console.log('[GameTimeout] Timeout checker stopped');
  }
}

async function checkGameTimeouts(io: Server) {
  try {
    const redisClient = getRedisClient();
    const currentTime = Date.now();

    const gameKeys = await redisClient.keys('TICTACTOE::GAME::*');

    if (gameKeys.length === 0) {
      return;
    }

    console.log(`[GameTimeout] Checking ${gameKeys.length} active games`);

    for (const gameKey of gameKeys) {
      try {
        const gameData = await redisClient.hGetAll(gameKey);

        if (!gameData || !gameData.last_move_time) {
          console.log(`[GameTimeout] Skipping ${gameKey} - no last_move_time`);
          continue;
        }

        const lastMoveTime = parseInt(gameData.last_move_time, 10);
        const timeSinceLastMove = currentTime - lastMoveTime;

        if (timeSinceLastMove > TIMEOUT_DURATION) {
          console.log(
            `[GameTimeout] Game ${gameKey} timed out (${
              timeSinceLastMove / 1000
            }s since last move)`
          );

          await handleGameTimeout(io, redisClient, gameKey, gameData);
        }
      } catch (error) {
        console.error(`[GameTimeout] Error processing game ${gameKey}:`, error);
      }
    }
  } catch (error) {
    console.error('[GameTimeout] Error in checkGameTimeouts:', error);
  }
}

async function handleGameTimeout(
  io: Server,
  redisClient: any,
  gameKey: string,
  gameData: Record<string, string>
) {
  try {
    const gameId = gameKey.replace('TICTACTOE::GAME::', '');
    const currentTurn = gameData.current_turn;
    const gameBoard = JSON.parse(gameData.game_board || '[]');

    const playerIds = Object.keys(gameData).filter(
      (key) =>
        !['current_turn', 'game_board', 'last_move_time'].includes(key) &&
        gameData[key] &&
        (gameData[key] === 'X' || gameData[key] === 'O')
    );

    if (playerIds.length !== 2) {
      console.log(
        `[GameTimeout] Invalid player count for game ${gameId}:`,
        playerIds
      );
      await redisClient.del(gameKey);
      return;
    }

    const playerOne = playerIds[0];
    const playerTwo = playerIds[1];

    if (!playerOne || !playerTwo) {
      console.log(`[GameTimeout] Invalid player IDs for game ${gameId}`);
      await redisClient.del(gameKey);
      return;
    }

    const loser = currentTurn;
    const winner = playerOne === loser ? playerTwo : playerOne;

    console.log(
      `[GameTimeout] Game ${gameId} - Winner: ${winner}, Loser: ${loser} (timeout)`
    );

    io.to(gameId).emit('game_over', {
      message: `Game Over! Player ${loser} timed out. Player ${winner} wins!`,
      winner: winner,
      data: gameBoard,
      success: true,
      reason: 'timeout',
    });

    try {
      await GameModel.create({
        game_id: gameId,
        player_one_id: playerOne,
        player_two_id: playerTwo,
        player_one_move: gameData[playerOne] || '',
        player_two_move: gameData[playerTwo] || '',
        winner: winner,
        final_board: gameBoard,
      });
      console.log(`[GameTimeout] Game ${gameId} saved to database`);
    } catch (dbError) {
      console.error(
        `[GameTimeout] Error saving game ${gameId} to database:`,
        dbError
      );
    }

    await redisClient.hDel(userIdKey(playerOne), 'game_id');
    await redisClient.hDel(userIdKey(playerTwo), 'game_id');
    await redisClient.del(gameKey);

    console.log(`[GameTimeout] Game ${gameId} cleaned up from Redis`);
  } catch (error) {
    console.error(
      `[GameTimeout] Error handling timeout for ${gameKey}:`,
      error
    );
  }
}
