import { Document } from 'mongoose';

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
}

export {};
