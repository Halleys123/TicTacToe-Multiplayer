// middlewares/authentication.ts
import AppError from '@utils/AppError.js';
import catchAsync from '@utils/catchAsync.js';
import tokenVerification from '@utils/tokenVerification.js';
import { NextFunction, Request, Response } from 'express';

function assertUser(req: Request): asserts req is AuthenticatedRequest {
  if (!req.user) {
    throw new AppError('User not attached to request', 500, true);
  }
}

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

    // ensure type narrow for downstream handlers
    assertUser(req);

    next();
  }
);

export default Authentication;
