// src/middleware/authorization.ts
import { FastifyRequest, FastifyReply } from 'fastify';

interface UserPayload {
  id: string;
  role: string;
}

export function authorize(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as UserPayload;

      if (!roles.includes(user.role)) {
        reply.status(403).send({ error: 'Forbidden: Insufficient permissions' });
        return;
      }
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  };
}
