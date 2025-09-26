import { Server, Socket } from 'socket.io';

let io: Server;

function initSockets() {
  console.log('Sockets listening on port: ', process.env.SOCKET_PORT);
  io = new Server(Number(process.env.SOCKET_PORT));

  io.on('connection', (socket: Socket) => {
    console.log('Socket connected: ', socket.id);

    socket.on('disconnect', () => {
      console.log('Socket disconnected: ', socket.id);
    });
  });
}

export default initSockets;
