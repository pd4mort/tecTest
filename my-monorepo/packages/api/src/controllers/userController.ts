import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { UserParams, UserBody } from '../types/userTypes';
import { JwtPayload } from '../types/authTypes';

export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany();
  reply.send(users);
}

export async function getUserById(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
  const { id } = request.params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    reply.status(404).send({ error: 'User not found' });
    return;
  }

  reply.send(user);
}

export async function createUser(request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) {
  const { email, name, password, role } = request.body;

  const user = await prisma.user.create({
    data: { email, name, password, role }
  });

  reply.status(201).send(user);
}

export async function updateUser(request: FastifyRequest<{ Params: UserParams; Body: Partial<UserBody> }>, reply: FastifyReply) {
  const { id } = request.params;
  const { email, name, role } = request.body;
  const user = request.user as JwtPayload; // Usa el tipo JwtPayload para tipar el usuario autenticado

  // Verificar si el usuario tiene permiso para actualizar el recurso
  if (user.role !== 'god' && user.role !== 'admin' && user.id !== id) {
    reply.status(403).send({ error: 'Forbidden: You can only edit your own profile' });
    return;
  }

  // Si el usuario es de rol 'user', no puede cambiar su propio rol
  const updateData: Partial<UserBody> = { email, name };
  if (user.role !== 'god' && user.role !== 'admin') {
    delete updateData.role;
    reply.status(403).send({ error: 'Forbidden: You can only edit your own profile' });
  } else {
    updateData.role = role;
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData
  });

  reply.send(updatedUser);
}

export async function deleteUser(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
  const { id } = request.params;

  await prisma.user.delete({ where: { id } });

  reply.status(204).send();
}
