import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { PostBody } from '../types/postTypes';
import { string } from 'zod';

/**
 * Crea un nuevo post.
 * @param {FastifyRequest} request - Solicitud con datos del post.
 * @param {FastifyReply} reply - Respuesta del servidor.
 */
export async function createPost(request: FastifyRequest<{ Body: PostBody }>, reply: FastifyReply) {
  try {
    const { title, content, authorId } = request.body;

    // Creación del post en la base de datos
    const post = await prisma.post.create({
      data: { title, content, authorId }
    });

    // Respuesta con el post creado
    reply.status(201).send(post);
  } catch (error) {
    console.error('Error creating post:', error);
    reply.status(500).send({ error: 'Error creating post' });
  }
}

/**
 * Obtiene un post por su ID.
 * @param {FastifyRequest} request - Solicitud con el ID del post.
 * @param {FastifyReply} reply - Respuesta del servidor.
 */
export async function getPostById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;

    // Búsqueda del post en la base de datos
    const post = await prisma.post.findUnique({ where: { id: string } });

    if (!post) {
      reply.status(404).send({ error: 'Post not found' });
      return;
    }

    // Respuesta con el post encontrado
    reply.send(post);
  } catch (error) {
    console.error('Error retrieving post:', error);
    reply.status(500).send({ error: 'Error retrieving post' });
  }
}

/**
 * Actualiza un post existente.
 * @param {FastifyRequest} request - Solicitud con los datos del post a actualizar.
 * @param {FastifyReply} reply - Respuesta del servidor.
 */
export async function updatePost(request: FastifyRequest<{ Params: { id: string }, Body: Partial<PostBody> }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const { title, content } = request.body;

    // Actualización del post en la base de datos
    const post = await prisma.post.update({
      where: { id: parseInt(id, 10) },
      data: { title, content }
    });

    // Respuesta con el post actualizado
    reply.send(post);
  } catch (error) {
    console.error('Error updating post:', error);
    reply.status(500).send({ error: 'Error updating post' });
  }
}

/**
 * Elimina un post por su ID.
 * @param {FastifyRequest} request - Solicitud con el ID del post a eliminar.
 * @param {FastifyReply} reply - Respuesta del servidor.
 */
export async function deletePost(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;

    // Eliminación del post de la base de datos
    await prisma.post.delete({ where: { id: parseInt(id, 10) } });

    // Respuesta de confirmación
    reply.status(204).send();
  } catch (error) {
    console.error('Error deleting post:', error);
    reply.status(500).send({ error: 'Error deleting post' });
  }
}
