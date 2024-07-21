import { FastifyPluginAsync } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';

const postRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/posts', async (request, reply) => {
    const posts = await prisma.post.findMany();
    reply.send(posts);
  });

  fastify.post('/posts', async (request, reply) => {
    const { title, content, authorId } = request.body as any;
    const newPost = await prisma.post.create({
      data: { title, content, authorId },
    });
    reply.code(201).send(newPost);
  });

  fastify.delete('/posts/:id', async (request, reply) => {
    const { id } = request.params as any;
    const post = await prisma.post.delete({
      where: { id: Number(id) },
    });
    reply.send(post);
  });
};

export default postRoutes;
