import { Document } from 'mongoose';

declare global {
  interface IUser extends Document {
    googleId: string;
    username: string;
    displayName: string;
  }

  interface IResponse {
    data: any;
    message: string;
    statusCode: number;
    success: boolean;
    status: 'success' | 'fail' | 'error';
    stack?: any;
  }
}

export {};
