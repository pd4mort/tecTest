import { FastifyRequest, FastifyReply } from 'fastify';
import * as postService from '../services/postService';
import { PostBody, PostParams } from '../types/postTypes';
import { createPostSchema, updatePostSchema, postParamsSchema } from '../validations/postValidation';
import { JwtPayload } from '../types/authTypes';
import { notifyAllClients } from '@my-monorepo/services/notifications/websocketServer';

/**
 * Create a new post.
 * @param {FastifyRequest<{ Body: PostBody }>} request - Request with post data.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response with the created post on success.
 */
export async function createPostController(request: FastifyRequest<{ Body: PostBody }>, reply: FastifyReply): Promise<void> {
  const parsed = createPostSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid post data', details: parsed.error.errors });
  }

  try {
    const user = request.user as JwtPayload;
    const post = await postService.createPost({ ...parsed.data, authorId: user.id });
    reply.status(201).send(post);

    const messageData = { text:'New post available => ' + post.title };
    createNewMessage(messageData);

  } catch (error) {
    console.error('Error creating post:', error);
    reply.status(500).send({ error: 'Error creating post' });
  }
}

/**
 * Retrieves all posts from the database.
 * @param {FastifyRequest} request - The Fastify request object.
 * @param {FastifyReply} reply - The Fastify reply object.
 * @returns {Promise<void>} - Sends a response with the list of all posts or an error message.
 */
export async function getAllPostsController(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // Fetch all posts from the service
    const posts = await postService.getAllPosts();

    // Send the list of posts in the response
    reply.send(posts);
  } catch (error) {
    console.error('Error retrieving posts:', error);
    reply.status(500).send({ error: 'Error retrieving posts' });
  }
}

/**
 * Get a post by its ID.
 * @param {FastifyRequest<{ Params: PostParams }>} request - Request with post ID.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response with the requested message on success.
 */
export async function getPostByIdController(request: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply): Promise<void> {
  const { id } = request.params;
  const parsed = postParamsSchema.safeParse({ id });
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid post ID' });
  }

  try {
    const post = await postService.getPostById(id);
    if (!post) {
      reply.status(404).send({ error: 'Post not found' });
      return;
    }
    reply.send(post);
  } catch (error) {
    console.error('Error retrieving post:', error);
    reply.status(500).send({ error: 'Error retrieving post' });
  }
}

/**
 * Update an existing post.
 * @param {FastifyRequest<{ Params: PostParams; Body: Partial<PostBody> }>} request - Request with the post data to update.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response with the updated message in case of success.
 */
export async function updatePostController(request: FastifyRequest<{ Params: PostParams; Body: Partial<PostBody> }>, reply: FastifyReply): Promise<void> {
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
    if (!post) {
      reply.status(404).send({ error: 'Post not found' });
      return;
    }

    //notification
    const messageData = { text:'Post update => ' + post.title };
    createNewMessage(messageData);

    reply.send(post);
  } catch (error) {
    console.error('Error updating post:', error);
    reply.status(500).send({ error: 'Error updating post' });
  }
}

/**
 * Delete a post by its ID.
 * @param {FastifyRequest<{ Params: PostParams }>} request - Request with the ID of the post to be deleted.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response with the post's deletion status on success.
 */
export async function deletePostController(request: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply): Promise<void> {
  const { id } = request.params;
  const parsed = postParamsSchema.safeParse({ id });
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid post ID' });
  }

  try {
    await postService.deletePost(id);
    reply.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    reply.status(500).send({ error: 'Error deleting post' });
  }
}

//notifications
async function createNewMessage(messageData: { text: string; }) {
  
  notifyAllClients('New message: ' + messageData.text);
}
