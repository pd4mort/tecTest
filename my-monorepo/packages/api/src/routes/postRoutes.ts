import { FastifyInstance } from 'fastify';
import { getAllPostsController, getPostByIdController, createPostController, updatePostController, deletePostController } from '../controllers/postController';
import { authorize, authorizePostOwner } from '../middleware/authorization';
import { GetPostByIdParams, CreatePostBody, UpdatePostParams, DeletePostParams } from '../types/routeTypes';
import { UserRole } from '../types/userTypes';

async function postRoutes(server: FastifyInstance) {
  server.get('/posts', 
    { preHandler: [server.authenticate, authorize([UserRole.God, UserRole.Admin, UserRole.User])] }, 
    getAllPostsController
  );

  server.get<GetPostByIdParams>('/posts/:id', 
    { preHandler: [server.authenticate, authorize([UserRole.God, UserRole.Admin, UserRole.User])] }, 
    getPostByIdController
  );

  server.post<CreatePostBody>('/posts', 
    { preHandler: [server.authenticate, authorize([UserRole.God, UserRole.Admin, UserRole.User])] }, 
    createPostController
  );

  server.put<UpdatePostParams>('/posts/:id', 
    { preHandler: [server.authenticate, authorize([UserRole.God, UserRole.Admin, UserRole.User]), authorizePostOwner] }, 
    updatePostController
  );

  server.delete<DeletePostParams>('/posts/:id', 
    { preHandler: [server.authenticate, authorize([UserRole.God, UserRole.Admin]), authorizePostOwner] }, 
    deletePostController
  );
}

export default postRoutes;
