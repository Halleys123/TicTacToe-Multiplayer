import ErrorHandler from '@middleware/ErrorHandler.js';
import InvalidRoute from '@middleware/InvalidRoute.js';

import AuthRouter from '@routes/AuthRoutes.js';

import express, { Application } from 'express';

const app: Application = express();

app.use('/api/v1', AuthRouter);
app.use('*{any}', InvalidRoute);
app.use(ErrorHandler);

export default app;
