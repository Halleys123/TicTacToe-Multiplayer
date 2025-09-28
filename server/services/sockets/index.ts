import { env } from '@utils/listEnv.js';
import tokenVerification from '@utils/tokenVerification.js';
import { Server, Socket } from 'socket.io';

let io: Server;

function initSockets() {
  console.log('Sockets listening on port: ', env.SOCKET_PORT);
  io = new Server(Number(env.SOCKET_PORT));

  io.on('connection', async (socket: Socket) => {
    console.log('Socket connected: ', socket.id);
    io.to(socket.id).emit('hi', 'Welcome to the connection');

    const token: string | undefined =
      socket.handshake.headers.authorization?.split(' ')[1];

    const reply: ITokenVerification = await tokenVerification(token);

    if (!reply.success) {
      io.to(socket.id).emit(
        'auth_error',
        reply.errorMessage || 'There was some error'
      );
      setTimeout(() => socket.disconnect(true), 500);
      return;
    }

    socket.on('disconnect', () => {
      console.log('Socket disconnected: ', socket.id);
    });
  });
}

export default initSockets;
