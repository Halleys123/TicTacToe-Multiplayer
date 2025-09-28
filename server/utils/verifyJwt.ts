import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from './listEnv.js';

function verifyJwt(jwtToken: string): string | JwtPayload {
  return jwt.verify(jwtToken, env.JWT_SECRET);
}

export default verifyJwt;
