// src/types/fastify.d.ts
import 'fastify';

declare module 'fastify' {
  export interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
