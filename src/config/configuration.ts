import { EnvironmentVariables } from './env.validation';

export default (): EnvironmentVariables => ({
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
});
