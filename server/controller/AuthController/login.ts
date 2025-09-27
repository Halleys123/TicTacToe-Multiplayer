import catchAsync from '@utils/catchAsync.js';
import { env } from '@utils/listEnv.js';
import sendResponse from '@utils/sendResponse.js';
import { Request, Response } from 'express';
import { OAuth2Client, VerifyIdTokenOptions } from 'google-auth-library';
import UserModel from '@models/UserModel.js';

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

  const idTokenOption: VerifyIdTokenOptions = {
    idToken: token,
    audience: env.GOOGLE_CLIENT_ID,
  };

  const ticket = await client.verifyIdToken(idTokenOption);
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

  const userInfo = {
    email: payload.email,
    name: payload.name,
    email_verified: payload.email_verified,
    sub: payload.sub,
  };

  const isUser: IUser | null = await UserModel.findOne({
    email: userInfo.email,
  });

  // genereate tokens in either case

  if (isUser) {
    const response: IResponse = {
      message: 'Already a user logging you in',
      statusCode: 200,
      status: 'success',
      success: true,
      data: isUser,
    };

    sendResponse(res, response);
  } else {
    const user: IUser = new UserModel({
      username: crypto.randomUUID(),
      displayName: userInfo.name,
      email: userInfo.email,
    });

    await user.save();

    sendResponse(res, {
      data: userInfo,
      message: 'Login successful.',
      statusCode: 200,
      success: true,
      status: 'success',
    });
  }
});

export default login;
