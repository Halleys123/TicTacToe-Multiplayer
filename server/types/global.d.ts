import { Document } from 'mongoose';

declare global {
  interface IUser extends Document {
    googleId: string;
    username: string;
    displayName: string;
  }
}

export {};
