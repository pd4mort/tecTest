import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { PostBody, PostParams } from '../types/postTypes';

export async function getAllPosts(request: FastifyRequest, reply: FastifyReply) {
  try {
    const posts = await prisma.post.findMany();
    reply.send(posts);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error fetching posts' });
  }
}

export async function getPostById(request: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply) {
  const { id } = request.params;
  try {
    const post = await prisma.post.findUnique({
      where: { id }
    });
    if (post) {
      reply.send(post);
    } else {
      reply.status(404).send({ error: 'Post not found' });
    }
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error fetching post' });
  }
}

export async function createPost(request: FastifyRequest<{ Body: PostBody }>, reply: FastifyReply) {
  const { title, content, authorId } = request.body;
  try {
    const post = await prisma.post.create({
      data: { title, content, authorId }
    });
    reply.send(post);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error creating post' });
  }
}

export async function updatePost(request: FastifyRequest<{ Params: PostParams; Body: PostBody }>, reply: FastifyReply) {
  const { id } = request.params;
  const { title, content, authorId } = request.body;
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { title, content, authorId }
    });
    reply.send(post);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error updating post' });
  }
}

export async function deletePost(request: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply) {
  const { id } = request.params;
  try {
    await prisma.post.delete({
      where: { id }
    });
    reply.status(204).send();
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error deleting post' });
  }
}
