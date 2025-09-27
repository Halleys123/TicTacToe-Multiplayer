import AppError from '@utils/AppError.js';
import sendResponse from '@utils/sendResponse.js';
import { Request, Response } from 'express';

export default async function ErrorHandler(
  err: AppError,
  _req: Request,
  res: Response
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
