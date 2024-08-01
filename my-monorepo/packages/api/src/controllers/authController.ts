import { FastifyRequest, FastifyReply } from 'fastify';
import { hashPassword, verifyPassword, generateToken } from '../services/authService';
import prisma from '@my-monorepo/db/src/prismaClient';
import { UserBody } from '../types/userTypes';

/**
 * Registration of a new user.
 * @param {FastifyRequest} request - Request user data.
 * @param {FastifyReply} reply - Server response.
 */
export async function registerUser(request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) {
  try {
    const { email, name, password, role } = request.body;

    // User password hash
    const hashedPassword = await hashPassword(password);

    // BD user creation.
    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword, role }
    });

    // JWT user
    const token = generateToken({ id: user.id, role: user.role }, request.server);

    // Response user and Token.
    reply.status(201).send({ user, token });
  } catch (error) {
    console.error('Error registering user:', error);
    reply.status(500).send({ error: 'Error registering user' });
  }
}

/**
 * Login user.
 * @param {FastifyRequest} request - Request user credential.
 * @param {FastifyReply} reply - Server response.
 */
export async function loginUser(request: FastifyRequest<{ Body: { email: string, password: string } }>, reply: FastifyReply) {
  try {
    const { email, password } = request.body;

    // User exist?.
    const user = await prisma.user.findUnique({ where: { email } });

    // Password correct?.
    if (!user || !(await verifyPassword(user.password, password))) {
      reply.status(401).send({ error: 'Invalid email or password' });
      return;
    }

    // JWT login.
    const token = generateToken({ id: user.id, role: user.role }, request.server);

    // Token user response.
    reply.send({ user, token });
  } catch (error) {
    console.error('Error logging in:', error);
    reply.status(500).send({ error: 'Error logging in' });
  }
}
