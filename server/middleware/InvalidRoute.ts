import { Request, Response } from 'express';
import sendResponse from '@utils/sendResponse.js';

export default async function InvalidRoute() {
  (_req: Request, res: Response) => {
    const response: IResponse = {
      message: 'This route is not defined',
      status: 'error',
      statusCode: 400,
      data: null,
      success: false,
    };

    sendResponse(res, response);
  };
}
