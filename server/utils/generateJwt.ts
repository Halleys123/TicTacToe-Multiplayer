import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from './listEnv.js';
import type { StringValue } from 'ms';

function generateJwt(payload: { [key: string]: string }): string {
  const options: SignOptions = {
    expiresIn: env.JWT_TTL as StringValue,
  };

  const token: string = jwt.sign(payload, env.JWT_SECRET, options);
  return token;
}

export default generateJwt;
