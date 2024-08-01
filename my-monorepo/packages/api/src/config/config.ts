import { env } from '../validations/envValidation'

const config = {
  apiPrefix: '/api',
  port: env.PORT,
  jwt: {
    secret: env.SECRET_JWT
  }
};

export default config;
