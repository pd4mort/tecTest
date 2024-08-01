import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { UserBody } from '../types/userTypes';

/**
 * Crea un nuevo usuario.
 * @param {FastifyRequest} request - Solicitud con los datos del usuario.
 * @param {FastifyReply} reply - Respuesta del servidor.
 */
export async function createUser(request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) {
  try {
    const { username, email, password } = request.body;

    // Validación simple de datos de entrada
    if (!username || !email || !password) {
      reply.status(400).send({ error: 'Invalid input' });
      return;
    }

    // Creación del usuario en la base de datos
    const user = await prisma.user.create({
      data: { username, email, password }
    });

    // Respuesta con el usuario creado
    reply.status(201).send(user);
  } catch (error) {
    console.error('Error creating user:', error);
    reply.status(500).send({ error: 'Error creating user' });
  }
}

/**
 * Obtiene un usuario por su ID.
 * @param {FastifyRequest} request - Solicitud con el ID del usuario.
 * @param {FastifyReply} reply - Respuesta del servidor.
 */
export async function getUserById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;

    // Búsqueda del usuario en la base de datos
    const user = await prisma.user.findUnique({ where: { id: parseInt(id, 10) } });

    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }

    // Respuesta con el usuario encontrado
    reply.send(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    reply.status(500).send({ error: 'Error retrieving user' });
  }
}

/**
 * Actualiza un usuario existente.
 * @param {FastifyRequest} request - Solicitud con los datos del usuario a actualizar.
 * @param {FastifyReply} reply - Respuesta del servidor.
 */
export async function updateUser(request: FastifyRequest<{ Params: { id: string }, Body: Partial<UserBody> }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const { username, email, password } = request.body;

    // Validación de datos actualizados
    if (!username && !email && !password) {
      reply.status(400).send({ error: 'No valid fields provided for update' });
      return;
    }

    // Actualización del usuario en la base de datos
    const user = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: { username, email, password }
    });

    // Respuesta con el usuario actualizado
    reply.send(user);
  } catch (error) {
    console.error('Error updating user:', error);
    reply.status(500).send({ error: 'Error updating user' });
  }
}

/**
 * Elimina un usuario por su ID.
 * @param {FastifyRequest} request - Solicitud con el ID del usuario a eliminar.
 * @param {FastifyReply} reply - Respuesta del servidor.
 */
export async function deleteUser(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;

    // Eliminación del usuario de la base de datos
    await prisma.user.delete({ where: { id: parseInt(id, 10) } });

    // Respuesta de confirmación
    reply.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    reply.status(500).send({ error: 'Error deleting user' });
  }
}
