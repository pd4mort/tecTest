import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';

// Define una interfaz para el cuerpo de la solicitud de post
interface PostBody {
  title: string;
  content: string;
  authorId: string;
}

// Define una interfaz para los parámetros de solicitud
interface PostParams {
  id: string;
}

async function postRoutes(server: FastifyInstance) {
  // Ruta para obtener todos los posts
  server.get('/posts', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Obtener todos los posts
      const posts = await prisma.post.findMany();
      reply.send(posts);
    } catch (error) {
      console.error(error); // Para depuración
      reply.status(500).send({ error: 'Error fetching posts' });
    }
  });

  // Ruta para obtener un post por ID
  server.get('/posts/:id', async (request: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply) => {
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
      console.error(error); // Para depuración
      reply.status(500).send({ error: 'Error fetching post' });
    }
  });

  // Ruta para crear un nuevo post
  server.post('/posts', async (request: FastifyRequest<{ Body: PostBody }>, reply: FastifyReply) => {
    const { title, content, authorId } = request.body;
    try {
      const post = await prisma.post.create({
        data: { title, content, authorId }
      });
      reply.send(post);
    } catch (error) {
      console.error(error); // Para depuración
      reply.status(500).send({ error: 'Error creating post' });
    }
  });

  // Ruta para actualizar un post por ID
  server.put('/posts/:id', async (request: FastifyRequest<{ Params: PostParams; Body: PostBody }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { title, content, authorId } = request.body;
    try {
      const post = await prisma.post.update({
        where: { id },
        data: { title, content, authorId }
      });
      reply.send(post);
    } catch (error) {
      console.error(error); // Para depuración
      reply.status(500).send({ error: 'Error updating post' });
    }
  });

  // Ruta para eliminar un post por ID
  server.delete('/posts/:id', async (request: FastifyRequest<{ Params: PostParams }>, reply: FastifyReply) => {
    const { id } = request.params;
    try {
      await prisma.post.delete({
        where: { id }
      });
      reply.status(204).send();
    } catch (error) {
      console.error(error); // Para depuración
      reply.status(500).send({ error: 'Error deleting post' });
    }
  });
}

export default postRoutes;
