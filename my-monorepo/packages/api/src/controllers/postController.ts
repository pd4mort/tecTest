import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { createPostSchema, updatePostSchema, postParamsSchema } from '../validations/postValidation';

export async function getAllPosts(request: FastifyRequest, reply: FastifyReply) {
  try {
    const posts = await prisma.post.findMany();
    reply.send(posts);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error fetching posts' });
  }
}

export async function getPostById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params;
  const parsed = postParamsSchema.safeParse({ id });
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid post ID' });
  }

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

export async function createPost(request: FastifyRequest<{ Body: { title: string, content: string, authorId: string } }>, reply: FastifyReply) {
  const parsed = createPostSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid post data', details: parsed.error.errors });
  }

  const { title, content, authorId } = parsed.data;
  try {
    const userExists = await prisma.user.findUnique({ where: { id: authorId } });
    if (!userExists) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const post = await prisma.post.create({
      data: { title, content, authorId }
    });
    reply.send(post);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error creating post' });
  }
}

export async function updatePost(request: FastifyRequest<{ Params: { id: string }, Body: { title?: string, content?: string, authorId?: string } }>, reply: FastifyReply) {
  const { id } = request.params;
  const parsedParams = postParamsSchema.safeParse({ id });
  if (!parsedParams.success) {
    return reply.status(400).send({ error: 'Invalid post ID' });
  }

  const parsedBody = updatePostSchema.safeParse(request.body);
  if (!parsedBody.success) {
    return reply.status(400).send({ error: 'Invalid post data', details: parsedBody.error.errors });
  }

  const { title, content, authorId } = parsedBody.data;
  try {
    if (authorId) {
      const userExists = await prisma.user.findUnique({ where: { id: authorId } });
      if (!userExists) {
        return reply.status(404).send({ error: 'User not found' });
      }
    }

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

export async function deletePost(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  const { id } = request.params;
  const parsed = postParamsSchema.safeParse({ id });
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid post ID' });
  }

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
