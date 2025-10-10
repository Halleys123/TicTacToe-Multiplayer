import { Document } from 'mongoose';
import express from 'express';

declare global {
  interface IUser extends Document {
    _id: string;
    username: string;
    displayName: string;
    email?: string;
  }

  interface IGame extends Document {
    game_id: string;
    player_one_id: mongoose.Types.ObjectId;
    player_two_id: mongoose.Types.ObjectId;

    player_one_move: string;
    player_two_move: string;

    winner: mongoose.Types.ObjectId;

    final_board: string[][];
  }

  interface IResponse {
    data: any;
    message: string;
    statusCode: number;
    success: boolean;
    status: 'success' | 'fail' | 'error';
    stack?: any;
  }

  interface ITokenVerification {
    success: boolean;
    errorMessage: null | string;
    data: IUser | null;
    statusCode: number;
  }

  namespace Express {
    interface Request {
      user?: IUser;
    }
  }

  interface AuthenticatedRequest extends express.Request {
    user: IUser;
  }
}

export {};
