import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { UserBody } from '../types/userTypes';
import { JwtPayload } from '../types/authTypes';
import { hashPassword, verifyPassword, generateToken } from '../services/authService';

/**
 * Register a new user
 * @param {FastifyRequest<{ Body: UserBody }>} request - Fastify request object with UserBody in the body
 * @param {FastifyReply} reply - Fastify reply object to send the response
 * @returns {Promise<void>} - Returns nothing directly but sends response with user and token on success
 */
export async function registerUser(request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply): Promise<void> {
  try {
    const { email, name, password, role } = request.body;
    const userRole = role || 'user';
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword, role: userRole }
    });

    const token = generateToken({ id: user.id, role: user.role } as JwtPayload, request.server);
    reply.status(201).send({ user, token });
  } catch (error) {
    console.error('Error registering user:', error);
    reply.status(500).send({ error: 'Error registering user' });
  }
}

/**
 * Log in a user with email and password
 * @param {FastifyRequest<{ Body: { email: string, password: string } }>} request - Fastify request object with email and password in the body
 * @param {FastifyReply} reply - Fastify reply object to send the response
 * @returns {Promise<void>} - Returns nothing directly but sends response with user and token on success, or error message on failure
 */
export async function loginUser(request: FastifyRequest<{ Body: { email: string, password: string } }>, reply: FastifyReply): Promise<void> {
  try {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(user.password, password))) {
      reply.status(401).send({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken({ id: user.id, role: user.role } as JwtPayload, request.server);
    reply.send({ user, token });
  } catch (error) {
    console.error('Error logging in:', error);
    reply.status(500).send({ error: 'Error logging in' });
  }
}
