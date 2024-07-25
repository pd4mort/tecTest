import { FastifyInstance } from 'fastify';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/postController';

async function postRoutes(server: FastifyInstance) {
  server.get('/posts', getAllPosts);
  server.get('/posts/:id', getPostById);
  server.post('/posts', createPost);
  server.put('/posts/:id', updatePost);
  server.delete('/posts/:id', deletePost);
}

export default postRoutes;
