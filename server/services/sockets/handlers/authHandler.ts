import { RedisClientType } from 'redis';
import { userIdKey } from '@services/redis/redisKeys.js';
import tokenVerification from '@utils/tokenVerification.js';
import { Server, Socket } from 'socket.io';

export default async function authHandler(
  io: Server,
  socket: Socket,
  redisClient: RedisClientType
): Promise<IUser | null> {
  io.to(socket.id).emit('hi', 'Welcome to the connection');

  const token: string | undefined = socket.handshake.auth?.token?.split(' ')[1];

  const reply: ITokenVerification = await tokenVerification(token);

  if (!reply.success) {
    io.to(socket.id).emit(
      'auth_error',
      reply.errorMessage || 'There was some error'
    );
    setTimeout(() => socket.disconnect(true), 500);
    return null;
  }

  const user: IUser | null = reply.data;

  if (!user || !user._id) {
    io.to(socket.id).emit('auth_error', 'User not verified');
    setTimeout(() => socket.disconnect(true), 500);
    return null;
  }

  await redisClient.hSet(userIdKey(String(user?._id)), 'socket_id', socket.id);
  await redisClient.expire(userIdKey(String(user?._id)), 72000);

  return user;
}
