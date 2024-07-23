import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { UserBody, UserParams } from '../types/userTypes';

export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await prisma.user.findMany();
    reply.send(users);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error fetching users' });
  }
}

export async function getUserById(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
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
    console.error(error);
    reply.status(500).send({ error: 'Error fetching user' });
  }
}

export async function createUser(request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) {
  const { email, name, password, role } = request.body;
  try {
    const user = await prisma.user.create({
      data: { email, name, password, role: role ?? 'user' }
    });
    reply.send(user);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error creating user' });
  }
}

export async function updateUser(request: FastifyRequest<{ Params: UserParams; Body: UserBody }>, reply: FastifyReply) {
  const { id } = request.params;
  const { email, name, password, role } = request.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { email, name, password, role }
    });
    reply.send(user);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error updating user' });
  }
}

export async function deleteUser(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
  const { id } = request.params;
  try {
    await prisma.user.delete({
      where: { id }
    });
    reply.status(204).send();
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error deleting user' });
  }
}
