import { EnvironmentVariables } from './env.validation';

export interface AppConfig {
  port: number;
  nodeEnv: string;
  database: {
    uri: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const createAppConfig = (env: EnvironmentVariables): AppConfig => ({
  port: env.PORT || 3000,
  nodeEnv: env.NODE_ENV || 'development',
  database: {
    uri: env.MONGO_URI,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
  },
});

// Type-safe configuration getter
export const getAppConfig = (): AppConfig => {
  // This will be injected by NestJS ConfigService
  throw new Error('Configuration not initialized. Use ConfigService instead.');
};
