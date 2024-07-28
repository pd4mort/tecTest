import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { JwtPayload } from '../types/authTypes';

export function authorize(roles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as JwtPayload;

      if (!roles.includes(user.role)) {
        reply.status(403).send({ error: 'Forbidden: Insufficient permissions' });
        return;
      }
    } catch (err) {
      reply.status(401).send({ error: 'Unauthorized' });
    }
  };
}

export async function authorizePostOwner(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const user = await request.jwtVerify<JwtPayload>();
    const postId = request.params.id;
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      reply.status(404).send({ error: 'Post not found' });
      return;
    }

    if (post.authorId !== user.id && user.role === 'user') {
      reply.status(403).send({ error: 'Forbidden: You can only modify your own posts' });
      return;
    }
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized' });
  }
}
