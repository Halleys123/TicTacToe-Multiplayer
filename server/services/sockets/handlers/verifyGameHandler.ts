import { gameIdKey, userIdKey } from '@services/redis/redisKeys.js';
import { RedisClientType } from 'redis';
import { Socket } from 'socket.io';

export default async function verifyGameHandler(
  socket: Socket,
  redisClient: RedisClientType,
  user: IUser
) {
  socket.on('verify_game', async () => {
    const userId = String(user?._id);
    console.log('[verify_game] Checking game status for user:', userId);

    if (!userId) {
      console.log('[verify_game] User ID not found');
      socket.emit('verify_game_response', {
        message: 'User not authenticated',
        data: null,
        success: false,
        inGame: false,
      });
      return;
    }

    const gameId: string | null = await redisClient.hGet(
      userIdKey(userId),
      'game_id'
    );

    console.log('[verify_game] User gameId:', gameId);

    if (!gameId) {
      console.log('[verify_game] User not in any game');
      socket.emit('verify_game_response', {
        message: 'Not in any game',
        data: null,
        success: false,
        inGame: false,
      });
      return;
    }

    const game = { ...(await redisClient.hGetAll(gameIdKey(gameId))) };
    const keys = Object.keys(game);

    if (!game || keys.length < 5 || !keys[0] || !keys[1]) {
      console.log('[verify_game] Game not found or expired:', game);
      // Clean up stale game_id
      await redisClient.hDel(userIdKey(userId), 'game_id');
      socket.emit('verify_game_response', {
        message: 'Game not found or expired',
        data: null,
        success: false,
        inGame: false,
      });
      return;
    }

    // Join the game room if not already in it
    socket.join(gameId);

    // Parse game board
    if (game.game_board) {
      game.game_board = JSON.parse(game.game_board);
    }

    const timeElapsed = game.last_move_time
      ? (Date.now() - +(game.last_move_time as string)) / 1000
      : 0;

    console.log('[verify_game] User is in valid game:', gameId);
    socket.emit('verify_game_response', {
      message: 'In game',
      data: game,
      success: true,
      inGame: true,
      timeElapsed: timeElapsed,
    });
  });
}
