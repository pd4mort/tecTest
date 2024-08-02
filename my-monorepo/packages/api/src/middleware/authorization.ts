import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { JwtPayload } from '../types/authTypes';
import { UserRole } from '../types/userTypes';

/**
 * Middleware to authorize user based on roles.
 * @param {UserRole[]} roles - Array of roles that are authorized to access the route.
 * @returns {Function} - Middleware function to be used in Fastify routes.
 */
export function authorize(roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = request.user as JwtPayload;

      // Check if user role is included in allowed roles
      if (!roles.includes(user.role)) {
        reply.status(403).send({ error: 'Forbidden: Insufficient permissions' });
        return;
      }

      // If role is valid, proceed to next handler
      return;
    } catch (err) {
      console.error('Authorization error:', err);
      reply.status(401).send({ error: 'Unauthorized' });
    }
  };
}

/**
 * Middleware to authorize access to a post owner.
 * @param {FastifyRequest<{ Params: { id: string } }>} request - Request containing the post ID.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response upon success or failure.
 */
export async function authorizePostOwner(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply): Promise<void> {
  try {
    const user = await request.jwtVerify<JwtPayload>();
    const postId = request.params.id;

    // Fetch the post from the database
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      reply.status(404).send({ error: 'Post not found' });
      return;
    }

    // Check if the user is a 'god' or 'admin'
    if (user.role === UserRole.God || user.role === UserRole.Admin) {
      // Allow 'god' or 'admin' to modify any post
      return;
    }

    // Check if the user is the author of the post
    if (post.authorId !== user.id) {
      reply.status(403).send({ error: 'Forbidden: You can only modify your own posts' });
      return;
    }
  } catch (err) {
    console.error('Authorization error:', err);
    reply.status(401).send({ error: 'Unauthorized' });
  }
}
