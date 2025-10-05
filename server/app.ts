import ErrorHandler from '@middleware/ErrorHandler.js';
import InvalidRoute from '@middleware/InvalidRoute.js';

import AuthRouter from '@routes/AuthRoutes.js';
import GameRouter from '@routes/GameRoutes.js';

import express, { Application } from 'express';
import cors from 'cors';
import UserRouter from '@routes/UserRoutes.js';

const app: Application = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());

app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/game', GameRouter);
app.use('/api/v1/user', UserRouter);

app.all('{*any}', InvalidRoute);
app.use(ErrorHandler);

export default app;
