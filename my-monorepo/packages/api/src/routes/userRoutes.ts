import { FastifyPluginAsync } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient'

const userRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/users', async (request, reply) => {
    const users = await prisma.user.findMany();
    reply.send(users);
  });

  fastify.post('/users', async (request, reply) => {
    const { email, name, password } = request.body as any;
    const newUser = await prisma.user.create({
      data: { email, name, password },
    });
    reply.code(201).send(newUser);
  });

  fastify.delete('/users/:id', async (request, reply) => {
    const { id } = request.params as any;
    const user = await prisma.user.delete({
      where: { id: Number(id) },
    });
    reply.send(user);
  });
};

export default userRoutes;
