import { FastifyRequest, FastifyReply } from 'fastify';
import * as userService from '../services/userService';
import { UserBody, UserParams } from '../types/userTypes';

export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await userService.getAllUsers();
    reply.send(users);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      reply.status(500).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unknown error' });
    }
  }
}

export async function getUserById(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
  const { id } = request.params;
  try {
    const user = await userService.getUserById(id);
    reply.send(user);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      reply.status(error.message === 'Invalid user ID' ? 400 : 404).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unknown error' });
    }
  }
}

export async function createUser(request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) {
  try {
    const user = await userService.createUser(request.body);
    reply.status(201).send(user); // 201 Created
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      reply.status(400).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unknown error' });
    }
  }
}

export async function updateUser(request: FastifyRequest<{ Params: UserParams; Body: Partial<UserBody> }>, reply: FastifyReply) {
  const { id } = request.params;
  try {
    const user = await userService.updateUser(id, request.body);
    reply.send(user);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      reply.status(error.message === 'Invalid user ID' || error.message === 'User not found' ? 400 : 404).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unknown error' });
    }
  }
}

export async function deleteUser(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
  const { id } = request.params;
  try {
    await userService.deleteUser(id);
    reply.status(204).send(); // 204 No Content
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      reply.status(error.message === 'Invalid user ID' ? 400 : 404).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unknown error' });
    }
  }
}
