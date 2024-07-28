import { FastifyInstance } from 'fastify';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/postController';
import { authorize, authorizePostOwner } from '../middleware/authorization';
import { GetPostByIdParams, CreatePostBody, UpdatePostParams, DeletePostParams } from '../types/routeTypes';

async function postRoutes(server: FastifyInstance) {
  server.get('/posts', 
    { preHandler: [server.authenticate, authorize(['god', 'admin', 'user'])] }, 
    getAllPosts
  );

  server.get<GetPostByIdParams>('/posts/:id', 
    { preHandler: [server.authenticate, authorize(['god', 'admin', 'user'])] }, 
    getPostById
  );

  server.post<CreatePostBody>('/posts', 
    { preHandler: [server.authenticate, authorize(['god', 'admin', 'user'])] }, 
    createPost
  );

  server.put<UpdatePostParams>('/posts/:id', 
    { preHandler: [server.authenticate, authorize(['god', 'admin', 'user']), authorizePostOwner] }, 
    updatePost
  );

  server.delete<DeletePostParams>('/posts/:id', 
    { preHandler: [server.authenticate, authorize(['god', 'admin']), authorizePostOwner] }, 
    deletePost
  );
}

export default postRoutes;
