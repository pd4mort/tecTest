// src/plugins/auth.ts
import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import config from '../config/config';
import fastifyPlugin from 'fastify-plugin';

interface UserPayload {
  id: string;
  role: string;
}

const authPlugin: FastifyPluginCallback = (server, opts, done) => {
  server.register(fastifyJwt, {
    secret: config.jwt.secret
  });

  server.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = await req.jwtVerify<UserPayload>();
      req.user = user; // Añadir el usuario verificado al request
    } catch (err) {
      reply.send(err);
    }
  });

  done();
};

export default fastifyPlugin(authPlugin);
