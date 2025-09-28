import login from '@controller/AuthController/login.js';
import { Router } from 'express';
const AuthRouter = Router();

AuthRouter.post('/login', login);

export default AuthRouter;
