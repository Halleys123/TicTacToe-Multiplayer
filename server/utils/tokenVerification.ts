import UserModel from '@models/UserModel.js';
import verifyJwt from '@utils/verifyJwt.js';
import { JwtPayload } from 'jsonwebtoken';

export default async function tokenVerification(
  token: string | undefined
): Promise<ITokenVerification> {
  const reply: ITokenVerification = {
    success: false,
    data: null,
    errorMessage: null,
    statusCode: 500,
  };
  try {
    if (typeof token != 'string' || typeof token != 'undefined') {
      reply.errorMessage = 'Invalid token type';
      return reply;
    }

    if (!token) {
      reply.errorMessage = 'User not authenticated';
      reply.statusCode = 403;
      return reply;
    }

    const payload: JwtPayload | string = verifyJwt(token);

    if (typeof payload == 'string') {
      reply.errorMessage = 'Internal Server error';
      return reply;
    }

    const userId: string | undefined = payload._id;

    if (!userId) {
      reply.errorMessage = 'Internal Server error, Cant get id from payload';
      return reply;
    }

    const user: IUser | null = await UserModel.findById(userId);

    if (!user) {
      reply.errorMessage = 'No such user exists';
      return reply;
    }

    reply.success = true;
    reply.errorMessage = null;
    reply.statusCode = 200;
    reply.data = user;

    return reply;
  } catch (err: any) {
    return reply;
  }
}
