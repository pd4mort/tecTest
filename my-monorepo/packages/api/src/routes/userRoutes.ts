import { FastifyInstance } from 'fastify';
import { getAllUsersController, getUserByIdController, createUserController, updateUserController, deleteUserController, uploadProfilePictureController } from '../controllers/userController';
import { loginUser, registerUser } from '../controllers/authController';
import { authorize } from '../middleware/authorization';
import { UserParams, UserBody, UserRole } from '../types/userTypes';


async function userRoutes(server: FastifyInstance) {
  server.post('/register', registerUser);
  server.post('/login', loginUser);

  server.get('/users', { preHandler: [server.authenticate, authorize([UserRole.God, UserRole.Admin])] }, getAllUsersController);
  server.get<{ Params: UserParams }>('/users/:id', { preHandler: [server.authenticate, authorize([UserRole.God, UserRole.Admin])] }, getUserByIdController);
  server.post<{ Body: UserBody }>('/users', { preHandler: [server.authenticate, authorize([UserRole.God, UserRole.Admin])] }, createUserController);
  server.put<{ Params: UserParams; Body: Partial<UserBody> }>('/users/:id', { preHandler: [server.authenticate, authorize([UserRole.God, UserRole.Admin, UserRole.User])] }, updateUserController);
  server.delete<{ Params: UserParams }>('/users/:id', { preHandler: [server.authenticate, authorize([UserRole.God])] }, deleteUserController);

  server.post('/user/upload-profile-picture', { preHandler: [server.authenticate] }, uploadProfilePictureController);
}

export default userRoutes;
