import { RequestHandler } from 'express';
import AppError from '@utils/AppError.js';

const InvalidRoute: RequestHandler = (_req, _res, next) => {
  next(new AppError('Route not found', 404));
};

export default InvalidRoute;
