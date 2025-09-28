import AppError from '@utils/AppError.js';
import catchAsync from '@utils/catchAsync.js';
import tokenVerification from '@utils/tokenVerification.js';
import { NextFunction, Request, Response } from 'express';

const Authentication = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers.authorization?.split(' ')[1];

    const reply: ITokenVerification = await tokenVerification(token);

    if (!reply.success) {
      throw new AppError(
        reply.errorMessage || 'Unable to verify User',
        reply.statusCode,
        true
      );
    }

    if (!reply.data) {
      throw new AppError('Internal server corruption', 500, true);
    }

    req.user = reply.data;
    next();
  }
);

export default Authentication;
