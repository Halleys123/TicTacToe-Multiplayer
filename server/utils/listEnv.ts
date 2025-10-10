type EnvConfig = {
  NODE_ENV: string;
  SERVER_PORT: string | number;
  SOCKET_PORT: string | number;
  GOOGLE_CLIENT_ID: string;
  MONGO_URI: string;
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
  JWT_TTL: string;
  JWT_SECRET: string;
  GAME_CONFIG_MOVE_DURATION: number;
  GAME_CONFIG_CHECK_INTERVAL: number;
};

export const env: EnvConfig = new Proxy<EnvConfig>(
  {
    NODE_ENV: process.env.NODE_ENV || 'development',
    SERVER_PORT: process.env.SERVER_PORT || 3000,
    SOCKET_PORT: process.env.SOCKET_PORT || 3001,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
    MONGO_URI: process.env.MONGO_URI || '',
    MONGO_USERNAME: process.env.MONGO_USERNAME || '',
    MONGO_PASSWORD: process.env.MONGO_PASSWORD || '',
    JWT_SECRET: process.env.JWT_SECRET || '',
    JWT_TTL: process.env.JWT_TTL || '',
    GAME_CONFIG_MOVE_DURATION:
      Number(process.env.GAME_CONFIG_MOVE_DURATION) || 20000,
    GAME_CONFIG_CHECK_INTERVAL:
      Number(process.env.GAME_CONFIG_CHECK_INTERVAL) || 5000,
  },
  {
    get(target: EnvConfig, prop: keyof EnvConfig) {
      if (!(prop in target)) {
        console.log(
          `Environment variable ${prop} is not defined, using default value.`
        );
      }
      if (!process.env[prop] && target[prop]) {
        console.log(
          `Using default value, Variable (${prop}) is not declared in Environment file`
        );
      }
      return target[prop];
    },
  }
);
