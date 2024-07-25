import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { UserBody, UserParams } from '../types/userTypes';
import { createUserSchema, updateUserSchema, userParamsSchema } from '../validations/userValidation';

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
  const parsed = userParamsSchema.safeParse({ id });
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid user ID' });
  }

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
  const parsed = createUserSchema.safeParse(request.body);
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid user data', details: parsed.error.errors });
  }

  const { email, name, password, role } = parsed.data;
  try {
    const user = await prisma.user.create({
      data: { email, name, password, role }
    });
    reply.send(user);
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: 'Error creating user' });
  }
}

export async function updateUser(request: FastifyRequest<{ Params: UserParams; Body: UserBody }>, reply: FastifyReply) {
  const { id } = request.params;
  const parsedParams = userParamsSchema.safeParse({ id });
  if (!parsedParams.success) {
    return reply.status(400).send({ error: 'Invalid user ID' });
  }

  const parsedBody = updateUserSchema.safeParse(request.body);
  if (!parsedBody.success) {
    return reply.status(400).send({ error: 'Invalid user data', details: parsedBody.error.errors });
  }

  const { email, name, password, role } = parsedBody.data;
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
  const parsed = userParamsSchema.safeParse({ id });
  if (!parsed.success) {
    return reply.status(400).send({ error: 'Invalid user ID' });
  }

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
