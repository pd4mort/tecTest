import prisma from '@my-monorepo/db/src/prismaClient';
import { PostBody } from '../types/postTypes';
import wss from '@my-monorepo/services/notifications/websocketServer';
import WebSocket from 'ws';

//Notifications
const notifyClients = (message: string) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

// Get all posts
export async function getAllPosts() {
  try {
    return await prisma.post.findMany();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw new Error('Error fetching posts');
  }
}

// Get a post by ID
export async function getPostById(id: string) {
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

// Create a new post
export async function createPost(data: PostBody) {
  try {
    const newPost = await prisma.post.create({
      data
    });
    
    // Notificar a los clientes sobre el nuevo post
    notifyClients(`New post created: ${newPost.title}`);

    // Retornar el post creado
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Error creating post');
  }
}

// Update an existing post
export async function updatePost(id: string, data: Partial<PostBody>) {
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

// Delete a post
export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    throw new Error('Error deleting post');
  }
}
