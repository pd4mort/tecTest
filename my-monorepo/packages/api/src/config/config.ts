import { env } from '../validations/envValidation'

/**
 * @constant {object} config - Global configuration for the application.
 * @property {string} apiPrefix - Prefix for API routes.
 * @property {string} port - Port on which the server runs.
 * @property {object} jwt - JWT configuration.
 * @property {string} jwt.secret - Secret for signing the JWT.
 */
const config = {
  apiPrefix: '/api',
  port: env.PORT || "3000",
  jwt: {
    secret: env.SECRET_JWT || 'defaultsecret'
  }
};

export default config;
