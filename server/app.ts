import ErrorHandler from '@middleware/ErrorHandler.js';
import InvalidRoute from '@middleware/InvalidRoute.js';

import AuthRouter from '@routes/AuthRoutes.js';

import express, { Application } from 'express';
import cors from 'cors';

const app: Application = express();

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());

app.use('/api/v1/auth', AuthRouter);
app.all('{*any}', InvalidRoute);
app.use(ErrorHandler);

export default app;
