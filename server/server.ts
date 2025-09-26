import '@utils/setupEnv.js';
import app from './app.js';
import initSockets from '@services/sockets/index.js';

initSockets();

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server is listening on port:', process.env.SERVER_PORT);
});
