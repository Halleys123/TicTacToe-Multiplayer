import '@utils/setupEnv.js';
import '@utils/connectDb.js';

import app from './app.js';

import { env } from '@utils/listEnv.js';
import initSockets from '@services/sockets/index.js';

initSockets();

app.listen(env.SERVER_PORT, () => {
  console.log('Server is listening on port:', env.SERVER_PORT);
});
