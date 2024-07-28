// src/plugins/auth.ts
import { FastifyPluginCallback, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import config from '../config/config';
import fastifyPlugin from 'fastify-plugin';

const authPlugin: FastifyPluginCallback = (server, opts, done) => {
  server.register(fastifyJwt, {
    secret: config.jwt.secret,
  });

  server.decorate('authenticate', async function(req: FastifyRequest, reply: FastifyReply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  done();
};

export default fastifyPlugin(authPlugin);
