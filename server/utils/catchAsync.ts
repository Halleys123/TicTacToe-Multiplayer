// utils/catchAsync.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler<TReq extends Request = Request> = (
  req: TReq,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

function catchAsync<TReq extends Request = Request>(
  fn: AsyncRequestHandler<TReq>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req as TReq, res, next)).catch(next);
  };
}

export default catchAsync;
