import { Router, Request, Response } from 'express';

const AuthRouter = Router();

AuthRouter.get('/test', (_req: Request, res: Response) => {
  res.send('Working');
});
// AuthRouter.post('/login');

export default AuthRouter;
