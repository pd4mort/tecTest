// src/routes/userRoutes.ts
import { FastifyInstance } from 'fastify';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';
import { loginUser, registerUser } from '../controllers/authController';
import { UserParams, UserBody } from '../types/userTypes';

async function userRoutes(server: FastifyInstance) {
  server.post('/register', registerUser);
  server.post('/login', loginUser);

  server.get('/users', { preHandler: [server.authenticate] }, getAllUsers);
  server.get<{ Params: UserParams }>('/users/:id', { preHandler: [server.authenticate] }, getUserById);
  server.post<{ Body: UserBody }>('/users', { preHandler: [server.authenticate] }, createUser);
  server.put<{ Params: UserParams; Body: Partial<UserBody> }>('/users/:id', { preHandler: [server.authenticate] }, updateUser);
  server.delete<{ Params: UserParams }>('/users/:id', { preHandler: [server.authenticate] }, deleteUser);
}

export default userRoutes;
