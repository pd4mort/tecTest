import { FastifyRequest, FastifyReply } from 'fastify';

export async function getUser(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  // Logic to get a user
  return { user: { id, name: 'John Doe' } };
}

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const { name } = request.body as { name: string };
  // Logic to create a user
  return { user: { id: '123', name } };
}
