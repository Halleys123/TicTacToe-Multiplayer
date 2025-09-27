import AppError from '@utils/AppError.js';
import sendResponse from '@utils/sendResponse.js';
import { Request, Response, NextFunction } from 'express';

export default function ErrorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const message: string = err.message;
  let statusCode: number = 500;
  if (err.isOperational) {
    statusCode = err.statusCode;
  }

  const response: IResponse = {
    data: null,
    message: message,
    stack: err.stack,
    status: 'fail',
    statusCode: statusCode,
    success: false,
  };

  sendResponse(res, response);
}
