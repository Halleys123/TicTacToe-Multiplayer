import { Response } from 'express';

export default function sendResponse(res: Response, response: IResponse) {
  res.status(response.statusCode).json(response);
}
