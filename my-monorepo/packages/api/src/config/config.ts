import { env } from '../validations/envValidation'

const config = {
  apiPrefix: '/api',
  port: env.PORT || "3000",
  jwt: {
    secret: env.SECRET_JWT || 'defaultsecret'
  }
};

export default config;
