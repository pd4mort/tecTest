import { FastifyInstance } from 'fastify';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController';

async function userRoutes(server: FastifyInstance) {
  server.get('/users', getAllUsers);
  server.get('/users/:id', getUserById);
  server.post('/users', createUser);
  server.put('/users/:id', updateUser);
  server.delete('/users/:id', deleteUser);
}

export default userRoutes;
