import AuthRouter from '@routes/AuthRoutes.js';
import express, { Application } from 'express';

const app: Application = express();

app.use('/api/v1', AuthRouter);

export default app;
