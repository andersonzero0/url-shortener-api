import { EnvironmentVariables } from './env.validation';

export default (): EnvironmentVariables => ({
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  BASE_URL: process.env.BASE_URL,
  PORT: parseInt(process.env.PORT, 10) || 3000,
});
