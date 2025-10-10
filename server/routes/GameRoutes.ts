import { Router } from 'express';
import RandomMatchMake from '@controller/GameController/RandomMatchMake.js';
import Authentication from '@middleware/Authentication.js';
import CancelMatchMaking from '@controller/GameController/CancelMatchMake.js';
import CreateFriendMatch from '@controller/GameController/CreateFriendMatch.js';
import JoinFriendMatch from '@controller/GameController/JoinFriendMatch.js';
import Leaderboard from '@controller/GameController/Leaderboard.js';
import PlayerDetails from '@controller/GameController/PlayerDetails.js';

const GameRoutes = Router();

GameRoutes.post('/random-match-make', Authentication, RandomMatchMake);
GameRoutes.post('/create-friend-match', Authentication, CreateFriendMatch);
GameRoutes.post('/join-friend-match', Authentication, JoinFriendMatch);
GameRoutes.post('/cancel-match-make', Authentication, CancelMatchMaking);
GameRoutes.post('/leaderboard', Authentication, Leaderboard);
GameRoutes.get('/player/:playerId', Authentication, PlayerDetails);

export default GameRoutes;
