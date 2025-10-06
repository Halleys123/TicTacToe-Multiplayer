import getRedisClient from '@services/redis/index.js';
import { env } from '@utils/listEnv.js';
import { RedisClientType } from 'redis';
import { Server, Socket } from 'socket.io';
import authHandler from './handlers/authHandler.js';
import reconnectionHandler from './handlers/reconnectionHandler.js';
import gameHandler from './handlers/gameHandler.js';
import verifyGameHandler from './handlers/verifyGameHandler.js';

let io: Server | undefined;

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
    const redisClient: RedisClientType = getRedisClient();
    const user: IUser | null = await authHandler(io, socket, redisClient);

    if (!user) return;

    await reconnectionHandler(socket, redisClient, user);
    await verifyGameHandler(socket, redisClient, user);
    await gameHandler(io, socket, redisClient, user);

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
