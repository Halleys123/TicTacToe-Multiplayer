import { Document } from 'mongoose';
import express from 'express';

declare global {
  interface IUser extends Document {
    username: string;
    displayName: string;
    email?: string;
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
      user: IUser;
    }
  }
}

export {};
