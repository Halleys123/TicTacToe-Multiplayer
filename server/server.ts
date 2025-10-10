import '@utils/setupEnv.js';
import '@utils/connectDb.js';
import '@services/redis/index.js';
import '@services/sockets/index.js';

import app from './app.js';

import { env } from '@utils/listEnv.js';
import { stopGameTimeoutChecker } from '@services/gameTimeout.js';

const server = app.listen(env.SERVER_PORT, () => {
  console.log('Server is listening on port:', env.SERVER_PORT);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  stopGameTimeoutChecker();
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  stopGameTimeoutChecker();
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
