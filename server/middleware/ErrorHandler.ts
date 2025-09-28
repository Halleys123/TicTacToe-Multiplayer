import AppError from '@utils/AppError.js';
import sendResponse from '@utils/sendResponse.js';
import { ErrorRequestHandler } from 'express';

// Explicitly annotate as ErrorRequestHandler so Express' app.use overload resolves correctly
const ErrorHandler: ErrorRequestHandler = (err: AppError, _req, res, _next) => {
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
};

export default ErrorHandler;
