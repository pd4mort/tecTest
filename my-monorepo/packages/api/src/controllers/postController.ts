import { FastifyRequest, FastifyReply } from 'fastify';
import * as postService from '../services/postService';
import { PostBody, PostParams } from '../types/postTypes';
import { createPostSchema, updatePostSchema, postParamsSchema } from '../validations/postValidation';
import { JwtPayload } from '../types/authTypes';

export async function getAllPosts(request: FastifyRequest, reply: FastifyReply) {
  try {
    const posts = await postService.getAllPosts();
    reply.send(posts);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      reply.status(500).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unknown error' });
    }
  }
}

export async function getPostById(request: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply) {
  const { id } = request.params;
  const parsed = postParamsSchema.safeParse({ id });
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid post ID' });
  }

  try {
    const post = await postService.getPostById(id);
    reply.send(post);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      reply.status(error.message === 'Post not found' ? 404 : 500).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unknown error' });
    }
  }
}

export async function createPost(request: FastifyRequest<{ Body: PostBody }>, reply: FastifyReply) {
  const parsed = createPostSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid post data', details: parsed.error.errors });
  }

  try {
    const user = request.user as JwtPayload;
    const post = await postService.createPost({ ...parsed.data, authorId: user.id });
    reply.status(201).send(post); // 201 Created
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      reply.status(500).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unknown error' });
    }
  }
}

export async function updatePost(request: FastifyRequest<{ Params: PostParams; Body: Partial<PostBody> }>, reply: FastifyReply) {
  const { id } = request.params;
  const parsedParams = postParamsSchema.safeParse({ id });
  if (!parsedParams.success) {
    return reply.status(400).send({ error: 'Invalid post ID' });
  }

  const parsedBody = updatePostSchema.safeParse(request.body);
  if (!parsedBody.success) {
    return reply.status(400).send({ error: 'Invalid post data', details: parsedBody.error.errors });
  }

  try {
    const post = await postService.updatePost(id, parsedBody.data);
    reply.send(post);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      reply.status(error.message === 'Post not found' ? 404 : 500).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unknown error' });
    }
  }
}

export async function deletePost(request: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply) {
  const { id } = request.params;
  const parsed = postParamsSchema.safeParse({ id });
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid post ID' });
  }

  try {
    await postService.deletePost(id);
    reply.status(204).send(); // 204 No Content
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      reply.status(error.message === 'Post not found' ? 404 : 500).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unknown error' });
    }
  }
}
