import login from '@controller/AuthController/login.js';
import { Router } from 'express';
import { Request, Response } from 'express';
const AuthRouter = Router();

AuthRouter.post('/login', login);
AuthRouter.get('/test', (_req: Request, res: Response) => {
  res.send('working');
});

export default AuthRouter;
