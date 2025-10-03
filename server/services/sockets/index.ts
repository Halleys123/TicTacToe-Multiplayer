import GameModel from '@models/GameModel.js';
import getRedisClient from '@services/redis/index.js';
import { gameIdKey, userIdKey } from '@services/redis/redisKeys.js';
import { env } from '@utils/listEnv.js';
import tokenVerification from '@utils/tokenVerification.js';
import { RedisClientType } from 'redis';
import { Server, Socket } from 'socket.io';

let io: Server | undefined;

type GameBoard = [
  [string, string, string],
  [string, string, string],
  [string, string, string]
];

function checkWinner(
  game: GameBoard,
  curPlayer: string,
  row: number,
  col: number
) {
  if (game[row] && game[row].every((cell) => cell === curPlayer)) {
    return true;
  }
  if (game.every((r) => r[col] === curPlayer)) {
    return true;
  }
  if (row === col && game.every((r, idx) => r[idx] === curPlayer)) {
    return true;
  }
  if (row + col === 2 && game.every((r, idx) => r[2 - idx] === curPlayer)) {
    return true;
  }
  return false;
}

function initSockets() {
  console.log('Sockets listening on port: ', env.SOCKET_PORT);
  io = new Server(Number(env.SOCKET_PORT), {
    cors: {
      origin: '*',
    },
  });

  if (!io) return;

  io.on('connection', async (socket: Socket) => {
    if (!io) return;
    console.log('Socket connected: ', socket.id);
    io.to(socket.id).emit('hi', 'Welcome to the connection');

    const token: string | undefined =
      socket.handshake.auth?.token?.split(' ')[1];

    const reply: ITokenVerification = await tokenVerification(token);

    if (!reply.success) {
      io.to(socket.id).emit(
        'auth_error',
        reply.errorMessage || 'There was some error'
      );
      setTimeout(() => socket.disconnect(true), 500);
      return;
    }

    const user: IUser | null = reply.data;

    if (!user || !user._id) {
      io.to(socket.id).emit('auth_error', 'User not verified');
      setTimeout(() => socket.disconnect(true), 500);
      return;
    }

    const redisClient: RedisClientType = getRedisClient();
    await redisClient.hSet(
      userIdKey(String(user?._id)),
      'socket_id',
      socket.id
    );
    await redisClient.expire(userIdKey(String(user?._id)), 72000);

    const isPlayerInGame: string | null = await redisClient.hGet(
      userIdKey(String(user._id)),
      'game_id'
    );

    if (isPlayerInGame) {
      socket.join(isPlayerInGame);
      console.log(
        `[Socket ${socket.id}] Player rejoining game:`,
        isPlayerInGame
      );

      // Emit game state after a small delay to ensure client listeners are ready
      // This fixes race condition in Chrome where listeners aren't attached yet
      setTimeout(async () => {
        const game = {
          ...(await redisClient.hGetAll(gameIdKey(isPlayerInGame))),
        };

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
      }, 100); // 100ms delay
    } else {
      socket.emit('no_game', {
        success: false,
        data: null,
        message: 'Not in game anymore',
      });
    }

    socket.emit(
      'message',
      `Connected to the server your socket id is: ${socket.id}`
    );

    socket.on('game_update', async (data) => {
      const userId = String(user?._id);
      console.log(
        '[game_update] Received update from user:',
        userId,
        'with data:',
        data
      );

      if (!userId) {
        console.log('[game_update] User ID not found');
        socket.emit('game_message', {
          message: 'Internal server error user id not found',
          data: null,
          success: false,
        });
        return;
      }

      const gameId: string | null = await redisClient.hGet(
        userIdKey(userId),
        'game_id'
      );

      console.log('[game_update] Fetched gameId:', gameId);

      if (!gameId) {
        console.log('[game_update] User not in any game');
        socket.emit('game_message', {
          message: 'User not in any game',
          data: null,
          success: false,
        });
        return;
      }
      const game = { ...(await redisClient.hGetAll(gameIdKey(gameId))) };

      console.log('[game_update] Fetched game data:', game);

      const keys = Object.keys(game);

      if (!game || keys.length < 4 || !keys[0] || !keys[1]) {
        console.log('[game_update] Game data incomplete or not found:', game);
        socket.emit('game_message', {
          message: 'Game data incomplete or not found',
          data: null,
          success: false,
        });
        return;
      }

      const gameBoard = JSON.parse(game.game_board || '');
      console.log('[game_update] Parsed players and board:', {
        gameBoard,
      });

      if (userId != game.current_turn) {
        console.log(
          "[game_update] Not player's turn:",
          game,
          'Current turn:',
          game.current_turn
        );
        socket.emit('game_message', {
          message: 'It is not your turn',
          data: null,
          success: false,
        });
        return;
      }

      const newRow = data.row;
      const newCol = data.col;
      console.log('[game_update] Move position:', { newRow, newCol });

      if (gameBoard[newRow][newCol]) {
        console.log('[game_update] Board position already full:', {
          newRow,
          newCol,
        });
        socket.emit('game_message', {
          message: 'Board at given postion is already full',
          data: null,
          success: false,
        });
        return;
      }

      gameBoard[newRow][newCol] = game[game.current_turn];
      console.log('[game_update] Updated board:', gameBoard);

      if (checkWinner(gameBoard, game[userId] || '-', newRow, newCol)) {
        io?.to(gameId).emit('game_over', {
          message: `Game Over player ${userId} won!!!`,
          winner: game[userId],
          data: gameBoard,
          success: true,
        });

        await redisClient.hDel(userIdKey(keys[0]), 'game_id');
        await redisClient.hDel(userIdKey(keys[1]), 'game_id');

        await GameModel.create({
          game_id: gameId,
          player_one_id: keys[0],
          player_two_id: keys[1],
          player_one_move: game[keys[0]],
          player_two_move: game[keys[1]],
          winner: userId,
          final_board: game.board,
        });

        // Remove the game from Redis after a win
        await redisClient.del(gameIdKey(gameId));
        return;
      }

      game.current_turn = (keys[0] == userId ? keys[1] : keys[0]) || '';
      console.log('[game_update] Next turn:', game.current_turn);

      await redisClient.hSet(
        gameIdKey(gameId),
        'current_turn',
        game.current_turn ?? ''
      );
      console.log('[game_update] Saved current_turn to Redis');

      await redisClient.hSet(
        gameIdKey(gameId),
        'game_board',
        JSON.stringify(gameBoard)
      );
      console.log('[game_update] Saved game_board to Redis');

      game.game_board = gameBoard;

      io?.to(gameId).emit('game_message', {
        message: 'Game updated successfully',
        data: game,
        success: true,
      });
      console.log('[game_update] Emitted updated game to client');
      return;
    });

    socket.on('disconnect', async () => {
      await redisClient.del(`user:${String(user?._id)}`);
      console.log('Socket disconnected: ', socket.id);
    });
  });
}

function getIO(): Server | null {
  if (!io) {
    console.log('IO is not initialized');
    return null;
  }
  return io;
}

if (!io) initSockets();

export { initSockets };
export default getIO;
