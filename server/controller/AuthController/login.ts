import catchAsync from '@utils/catchAsync.js';
import sendResponse from '@utils/sendResponse.js';
import { Request, Response } from 'express';
import { OAuth2Client, VerifyIdTokenOptions } from 'google-auth-library';

const client = new OAuth2Client();

const login = catchAsync(async (req: Request, res: Response) => {
  const token: string | undefined = req.body.token;

  if (!token) {
    const response: IResponse = {
      data: null,
      message: 'Token is required.',
      statusCode: 400,
      success: false,
      status: 'fail',
    };
    sendResponse(res, response);
    return;
  }

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  } as VerifyIdTokenOptions);
  const payload = ticket.getPayload();

  if (!payload) {
    sendResponse(res, {
      data: null,
      message: 'Invalid token payload.',
      statusCode: 401,
      success: false,
      status: 'fail',
    });
    return;
  }

  if (!payload.email_verified) {
    sendResponse(res, {
      data: null,
      message: 'User is not verified, verify your google email',
      statusCode: 401,
      success: false,
      status: 'error',
    });

    return;
  }

  // You can extract user info from payload
  const userInfo = {
    email: payload.email,
    name: payload.name,
    email_verified: payload.email_verified,
    sub: payload.sub,
  };

  sendResponse(res, {
    data: userInfo,
    message: 'Login successful.',
    statusCode: 200,
    success: true,
    status: 'success',
  });
});

export default login;
