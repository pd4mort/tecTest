// src/controllers/authController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import argon2 from 'argon2';
import prisma from '@my-monorepo/db/src/prismaClient';
import { UserBody } from '../types/userTypes';

export async function registerUser(request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) {
  try {
    const { email, name, password, role } = request.body;
    const hashedPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: { email, name, password: hashedPassword, role }
    });

    const token = request.server.jwt.sign({ id: user.id, email: user.email });
    reply.status(201).send({ user, token });
  } catch (error) {
    console.error('Error registering user:', error);
    reply.status(500).send({ error: 'Error registering user' });
  }
}

export async function loginUser(request: FastifyRequest<{ Body: { email: string, password: string } }>, reply: FastifyReply) {
  try {
    const { email, password } = request.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await argon2.verify(user.password, password))) {
      reply.status(401).send({ error: 'Invalid email or password' });
      return;
    }

    const token = request.server.jwt.sign({ id: user.id, email: user.email });
    reply.send({ user, token });
  } catch (error) {
    console.error('Error logging in:', error);
    reply.status(500).send({ error: 'Error logging in' });
  }
}
