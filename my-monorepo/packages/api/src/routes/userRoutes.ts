import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';

async function userRoutes(server: FastifyInstance) {
  // Ruta para obtener todos los usuarios
  server.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Obtener todos los usuarios
      const users = await prisma.user.findMany();
      reply.send(users);
    } catch (error) {
      console.error(error); // Para depuración
      reply.status(500).send({ error: 'Error fetching users' });
    }
  });

  // Ruta para obtener un usuario por ID
  server.get('/users/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id }
      });
      if (user) {
        reply.send(user);
      } else {
        reply.status(404).send({ error: 'User not found' });
      }
    } catch (error) {
      console.error(error); // Para depuración
      reply.status(500).send({ error: 'Error fetching user' });
    }
  });

  // Ruta para crear un nuevo usuario
  server.post('/users', async (request: FastifyRequest<{ Body: { email: string, name: string, password: string } }>, reply: FastifyReply) => {
    const { email, name, password } = request.body;
    try {
      const user = await prisma.user.create({
        data: { email, name, password }
      });
      reply.send(user);
    } catch (error) {
      console.error(error); // Para depuración
      reply.status(500).send({ error: 'Error creating user' });
    }
  });

  // Ruta para actualizar un usuario por ID
  server.put('/users/:id', async (request: FastifyRequest<{ Params: { id: string }, Body: { email: string, name: string, password: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    const { email, name, password } = request.body;
    try {
      const user = await prisma.user.update({
        where: { id },
        data: { email, name, password }
      });
      reply.send(user);
    } catch (error) {
      console.error(error); // Para depuración
      reply.status(500).send({ error: 'Error updating user' });
    }
  });

  // Ruta para eliminar un usuario por ID
  server.delete('/users/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    try {
      await prisma.user.delete({
        where: { id }
      });
      reply.status(204).send();
    } catch (error) {
      console.error(error); // Para depuración
      reply.status(500).send({ error: 'Error deleting user' });
    }
  });
}

export default userRoutes;
