import UserStats from '@controller/UserController/Stats.js';
import Authentication from '@middleware/Authentication.js';
import { Router } from 'express';

const UserRouter = Router();

UserRouter.get('/stats', Authentication, UserStats);

export default UserRouter;
