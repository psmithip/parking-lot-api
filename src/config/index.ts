import dotenv from 'dotenv';

dotenv.config();
export const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
};
