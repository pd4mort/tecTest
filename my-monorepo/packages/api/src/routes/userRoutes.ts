// src/routes/userRoutes.ts
import { FastifyInstance } from 'fastify';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';
import { loginUser, registerUser } from '../controllers/authController';
import { authorize } from '../middleware/authorization';
import { UserParams, UserBody } from '../types/userTypes';

async function userRoutes(server: FastifyInstance) {
  server.post('/register', registerUser);
  server.post('/login', loginUser);

  server.get('/users', { preHandler: [server.authenticate, authorize(['god', 'admin'])] }, getAllUsers);
  server.get<{ Params: UserParams }>('/users/:id', { preHandler: [server.authenticate, authorize(['god', 'admin'])] }, getUserById);
  server.post<{ Body: UserBody }>('/users', { preHandler: [server.authenticate, authorize(['god', 'admin'])] }, createUser);
  server.put<{ Params: UserParams; Body: Partial<UserBody> }>('/users/:id', { preHandler: [server.authenticate, authorize(['god', 'admin', 'user'])] }, updateUser);
  server.delete<{ Params: UserParams }>('/users/:id', { preHandler: [server.authenticate, authorize(['god'])] }, deleteUser);
}

export default userRoutes;
