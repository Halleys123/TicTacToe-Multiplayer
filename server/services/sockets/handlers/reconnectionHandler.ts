import { gameIdKey, userIdKey } from '@services/redis/redisKeys.js';
import { RedisClientType } from 'redis';
import { Socket } from 'socket.io';

export default async function reconnectionHandler(
  socket: Socket,
  redisClient: RedisClientType,
  user: IUser
) {
  const isPlayerInGame: string | null = await redisClient.hGet(
    userIdKey(String(user._id)),
    'game_id'
  );

  if (isPlayerInGame) {
    socket.join(isPlayerInGame);
    console.log(`[Socket ${socket.id}] Player rejoining game:`, isPlayerInGame);

    // Emit game state after a small delay to ensure client listeners are ready
    // This fixes race condition in Chrome where listeners aren't attached yet
    setTimeout(async () => {
      const game = {
        ...(await redisClient.hGetAll(gameIdKey(isPlayerInGame))),
      };

      console.log(`[Socket ${socket.id}] Fetched game data:`, game);

      // Check if game data exists
      if (!game || Object.keys(game).length === 0) {
        console.log(`[Socket ${socket.id}] Game not found in Redis`);
        socket.emit('no_game', {
          success: false,
          data: null,
          message: 'Game not found',
        });
        await redisClient.hDel(userIdKey(String(user._id)), 'game_id');
        return;
      }

      const timeElapsed = game.last_move_time
        ? (Date.now() - +(game.last_move_time as string)) / 1000
        : 0;
      console.log('[Socket] Timer elapsed:', timeElapsed);
      socket.emit('timer_update', {
        data: timeElapsed,
        message: 'Timer updated',
        success: true,
      });

      // Parse the game_board from string to array
      if (game.game_board) {
        game.game_board = JSON.parse(game.game_board);
      }

      console.log(`[Socket ${socket.id}] Emitting game_message for rejoin`);
      socket.emit('game_message', {
        message: 'Rejoined game successfully',
        data: game,
        success: true,
      });
    }, 200); // Increased delay to 200ms
  } else {
    socket.emit('no_game', {
      success: false,
      data: null,
      message: 'Not in game anymore',
    });
  }
}
