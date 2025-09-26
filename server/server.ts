import dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV ? process.env.NODE_ENV : 'production'}`,
  quiet: true,
});

import app from './app.js';

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server is listening on port:', process.env.SERVER_PORT);
});
