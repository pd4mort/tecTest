import prisma from '@my-monorepo/db/src/prismaClient';
import { PostBody } from '../types/postTypes';
import wss from '@my-monorepo/services/notifications/websocketServer';
import WebSocket from 'ws';

// Notify clients for new post
const notifyClients = (message: string) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

/**
 * Retrieve all posts.
 * @returns {Promise<PostBody[]>} - Returns a promise resolving to a list of posts.
 * @throws {Error} - Throws an error if there is any issue fetching posts.
 */
export async function getAllPosts(): Promise<PostBody[]> {
  try {
    return await prisma.post.findMany();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Error fetching posts');
  }
}

/**
 * Retrieve a post by its ID.
 * @param {string} id - ID of the post to retrieve.
 * @returns {Promise<PostBody>} - Returns a promise resolving to the found post.
 * @throws {Error} - Throws an error if the post is not found.
 */
export async function getPostById(id: string): Promise<PostBody> {
  try {
    const post = await prisma.post.findUnique({
      where: { id }
    });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw new Error('Error fetching post');
  }
}

/**
 * Create a new post.
 * @param {PostBody} data - Data of the post to create.
 * @returns {Promise<PostBody>} - Returns a promise resolving to the created post.
 * @throws {Error} - Throws an error if there is any issue creating the post.
 */
export async function createPost(data: PostBody): Promise<PostBody> {
  try {
    const newPost = await prisma.post.create({
      data
    });
    
     // Notify clients about the new post
    notifyClients(`Nuevo post creado: ${newPost.title}`);

    // Return the created post
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Error creating post');
  }
}

/**
 * Update an existing post.
 * @param {string} id - ID of the post to update.
 * @param {Partial<PostBody>} data - Data of the post to update.
 * @returns {Promise<PostBody>} - Returns a promise resolving to the updated post.
 * @throws {Error} - Throws an error if there is any issue updating the post.
 */
export async function updatePost(id: string, data: Partial<PostBody>): Promise<PostBody> {
  try {
    const post = await prisma.post.update({
      where: { id },
      data
    });
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  } catch (error) {
    console.error('Error updating post:', error);
    throw new Error('Error updating post');
  }
}

/**
 * Delete a post by its ID.
 * @param {string} id - ID of the post to delete.
 * @throws {Error} - Throws an error if there is any issue deleting the post.
 */
export async function deletePost(id: string): Promise<void> {
  try {
    await prisma.post.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Error deleting post');
  }
}
