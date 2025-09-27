import '@utils/setupEnv.js';
import app from './app.js';
import initSockets from '@services/sockets/index.js';
import { env } from '@utils/listEnv.js';

initSockets();

app.listen(env.SERVER_PORT, () => {
  console.log('Server is listening on port:', env.SERVER_PORT);
});
