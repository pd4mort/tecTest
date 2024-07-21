import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getUser, createUser } from '../controllers/userController';

async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users/:id', getUser);
  fastify.post('/users', createUser);
}

export default userRoutes;
