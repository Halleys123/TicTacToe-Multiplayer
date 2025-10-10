import { Router } from 'express';
import RandomMatchMake from '@controller/GameController/RandomMatchMake.js';
import Authentication from '@middleware/Authentication.js';
import CancelMatchMaking from '@controller/GameController/CancelMatchMake.js';

const GameRoutes = Router();

GameRoutes.post('/random-match-make', Authentication, RandomMatchMake);
// GameRoutes.post('/create-friend');
GameRoutes.post('/cancel-match-make', Authentication, CancelMatchMaking);
export default GameRoutes;
