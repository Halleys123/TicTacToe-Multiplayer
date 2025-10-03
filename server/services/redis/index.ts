import AppError from '@utils/AppError.js';
import { createClient, RedisClientType } from 'redis';

let redisClient: RedisClientType | undefined;
let initializing: Promise<void> | null = null;

async function initRedis(): Promise<RedisClientType> {
  if (redisClient) return redisClient;
  if (!initializing) {
    console.log('\x1b[38;2;100;100;0mAttempting redis connection\x1b[0m');
    initializing = (async () => {
      try {
        redisClient = createClient();

        redisClient.on('error', (err) => {
          console.log('\x1b[38;2;200;50;0mRedis client error\x1b[0m');
          console.log(err);
        });

        await redisClient.connect();
        console.log('\x1b[38;2;0;160;60mRedis connected\x1b[0m');
      } catch (err) {
        console.log('\x1b[38;2;200;50;0mError connecting to redis\x1b[0m');
        console.log(err);
        redisClient = undefined;
        throw err;
      } finally {
        initializing = null;
      }
    })();
  }
  await initializing;
  if (!redisClient)
    throw new AppError('Redis client failed to initialize', 500, true);
  return redisClient;
}

function getRedisClient(): RedisClientType {
  if (!redisClient)
    throw new AppError(
      'Redis client is not initialized (call initRedis() first)',
      500,
      true
    );
  return redisClient;
}

if (!redisClient) await initRedis();

export { initRedis };
export default getRedisClient;
