import { Router } from 'express';
import RandomMatchMake from '@controller/GameController/RandomMatchMake.js';
import Authentication from '@middleware/Authentication.js';
import CancelMatchMaking from '@controller/GameController/CancelMatchMake.js';
import CreateFriendMatch from '@controller/GameController/CreateFriendMatch.js';
import JoinFriendMatch from '@controller/GameController/JoinFriendMatch.js';

const GameRoutes = Router();

GameRoutes.post('/random-match-make', Authentication, RandomMatchMake);
GameRoutes.post('/create-friend-match', Authentication, CreateFriendMatch);
GameRoutes.post('/join-friend-match', Authentication, JoinFriendMatch);
GameRoutes.post('/cancel-match-make', Authentication, CancelMatchMaking);
export default GameRoutes;
