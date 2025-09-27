import mongoose from 'mongoose';
import { env } from './listEnv.js';

let connectionString = env.MONGO_URI;

if (connectionString.includes('<USERNAME>')) {
  connectionString = connectionString.replace('<USERNAME>', env.MONGO_USERNAME);
}

if (connectionString.includes('<PASSWORD>')) {
  connectionString = connectionString.replace('<PASSWORD>', env.MONGO_PASSWORD);
}
try {
  console.log('Trying MongoDB connection');
  await mongoose.connect(env.MONGO_URI);
  console.log('\x1b[38;2;0;180;100mMongoDB connection succesful\x1b[0m');
} catch (err: any) {
  console.log('MongoDB connection failed');
  console.log(err);
}
