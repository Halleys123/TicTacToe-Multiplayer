import { Router } from 'express';
import RandomMatchMake from '@controller/GameController/RandomMatchMake.js';
import Authentication from '@middleware/Authentication.js';

const GameRoutes = Router();

GameRoutes.post('/random-match-make', Authentication, RandomMatchMake);

export default GameRoutes;
