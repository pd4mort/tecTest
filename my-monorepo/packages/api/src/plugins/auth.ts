// src/plugins/auth.ts
import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import config from '../config/config';
import fastifyPlugin from 'fastify-plugin';
import { JwtPayload } from '../types/authTypes';

const authPlugin: FastifyPluginCallback = (server, opts, done) => {
  server.register(fastifyJwt, {
    secret: config.jwt.secret,
    sign: {
      expiresIn: '1h'
    }
  });

  server.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      // Verify the JWT token and decode the payload
      const user = await req.jwtVerify<JwtPayload>();
      // Decorate the request with the authenticated user
      req.user = user;
    } catch (err) {
      // Sends an error response with status code 401 if the verification fails
      reply.status(401).send({ error: 'Unauthorized' });
    }
  });

  done();
};

export default fastifyPlugin(authPlugin);
