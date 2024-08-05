// postService.ts
import prisma from '@my-monorepo/db/src/prismaClient';
import { PostBody } from '../types/postTypes';
import wss from '@my-monorepo/services/notifications/websocketServer';
import WebSocket from 'ws';

// Notificar a los clientes sobre un nuevo post
const notifyClients = (message: string) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};

/**
 * Obtener todos los posts.
 * @returns {Promise<PostBody[]>} - Retorna una promesa que resuelve en una lista de posts.
 * @throws {Error} - Lanza un error si ocurre algún problema al obtener los posts.
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
 * Obtener un post por su ID.
 * @param {string} id - ID del post a obtener.
 * @returns {Promise<PostBody>} - Retorna una promesa que resuelve en el post encontrado.
 * @throws {Error} - Lanza un error si el post no es encontrado.
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
 * Crear un nuevo post.
 * @param {PostBody} data - Datos del post a crear.
 * @returns {Promise<PostBody>} - Retorna una promesa que resuelve en el post creado.
 * @throws {Error} - Lanza un error si ocurre algún problema al crear el post.
 */
export async function createPost(data: PostBody): Promise<PostBody> {
  try {
    const newPost = await prisma.post.create({
      data
    });
    
    // Notificar a los clientes sobre el nuevo post
    notifyClients(`Nuevo post creado: ${newPost.title}`);

    // Retornar el post creado
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Error creating post');
  }
}

/**
 * Actualizar un post existente.
 * @param {string} id - ID del post a actualizar.
 * @param {Partial<PostBody>} data - Datos del post a actualizar.
 * @returns {Promise<PostBody>} - Retorna una promesa que resuelve en el post actualizado.
 * @throws {Error} - Lanza un error si ocurre algún problema al actualizar el post.
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
 * Eliminar un post por su ID.
 * @param {string} id - ID del post a eliminar.
 * @throws {Error} - Lanza un error si ocurre algún problema al eliminar el post.
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
