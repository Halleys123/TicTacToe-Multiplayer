import '@utils/setupEnv.js';
import '@utils/connectDb.js';
import '@services/redis/index.js';
import '@services/sockets/index.js';

import app from './app.js';

import { env } from '@utils/listEnv.js';

app.listen(env.SERVER_PORT, () => {
  console.log('Server is listening on port:', env.SERVER_PORT);
});
