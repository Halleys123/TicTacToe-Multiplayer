import GameModel from '@models/GameModel.js';
import { gameIdKey, userIdKey } from '@services/redis/redisKeys.js';
import { RedisClientType } from 'redis';
import { Server, Socket } from 'socket.io';

export default async function gameHandler(
  io: Server,
  socket: Socket,
  redisClient: RedisClientType,
  user: IUser
) {
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
      socket.emit('no_game', {
        message: 'User not in any game',
        data: null,
        success: false,
      });
      // Clean up any stale game_id reference
      await redisClient.hDel(userIdKey(userId), 'game_id');
      return;
    }
    const game = { ...(await redisClient.hGetAll(gameIdKey(gameId))) };

    console.log('[game_update] Fetched game data:', game);

    const keys = Object.keys(game);

    if (!game || keys.length < 5 || !keys[0] || !keys[1]) {
      console.log('[game_update] Game data incomplete or not found:', game);
      socket.emit('no_game', {
        message: 'Game not found or expired',
        data: null,
        success: false,
      });
      // Clean up the stale game_id reference
      await redisClient.hDel(userIdKey(userId), 'game_id');
      return;
    }

    socket.emit('timer_update', {
      data: (Date.now() - +new Date(game.last_move_time as string)) / 1000,
      message: 'Timer updated',
      success: true,
    });

    const gameBoard = JSON.parse(game.game_board || '');
    console.log('[game_update] Parsed players and board:', {
      gameBoard,
    });

    if (userId !== game.current_turn) {
      console.log(
        "[game_update] Not player's turn:",
        'userId:',
        userId,
        'Current turn:',
        game.current_turn,
        'Type of userId:',
        typeof userId,
        'Type of current_turn:',
        typeof game.current_turn
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
        winner: userId,
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
        final_board: gameBoard,
      });

      // Remove the game from Redis after a win
      await redisClient.del(gameIdKey(gameId));
      return;
    } else if (isBoardFull(gameBoard)) {
      io?.to(gameId).emit('game_over', {
        message: "Game Over - It's a draw!",
        winner: null,
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
        winner: null,
        final_board: gameBoard,
      });

      // Remove the game from Redis after a draw
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

    const newLastUpdateTime = Date.now();
    await redisClient.hSet(
      gameIdKey(gameId),
      'last_move_time',
      newLastUpdateTime.toString()
    );
    console.log('[game_update] Saved game_board to Redis');

    game.game_board = gameBoard;

    io?.to(gameId).emit('game_message', {
      message: 'Game updated successfully',
      data: game,
      success: true,
    });

    io?.to(gameId).emit('timer_update', {
      message: 'New Timer',
      data: (Date.now() - newLastUpdateTime) / 1000,
      success: true,
    });
    console.log('[game_update] Emitted updated game to client');
    return;
  });
}

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

type GameBoard = [
  [string, string, string],
  [string, string, string],
  [string, string, string]
];
function isBoardFull(game: GameBoard): boolean {
  return game.every((row) => row.every((cell) => cell !== ''));
}
