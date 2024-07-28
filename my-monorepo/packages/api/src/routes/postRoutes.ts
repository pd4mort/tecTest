import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getAllPosts, getPostById, createPost, updatePost, deletePost } from '../controllers/postController';
import { authorize, authorizePostOwner } from '../middleware/authorization';
import { PostBody, PostParams } from '../types/postTypes';

interface GetPostByIdParams {
  Params: PostParams;
}

interface CreatePostBody {
  Body: PostBody;
}

interface UpdatePostParams {
  Params: PostParams;
  Body: Partial<PostBody>;
}

interface DeletePostParams {
  Params: PostParams;
}

async function postRoutes(server: FastifyInstance) {
  server.get('/posts', 
    { preHandler: [server.authenticate, authorize(['god', 'admin', 'user'])] }, 
    getAllPosts
  );

  server.get<{ Params: PostParams }>('/posts/:id', 
    { preHandler: [server.authenticate, authorize(['god', 'admin', 'user'])] }, 
    getPostById
  );

  server.post<{ Body: PostBody }>('/posts', 
    { preHandler: [server.authenticate, authorize(['god', 'admin', 'user'])] }, 
    createPost
  );

  server.put<{ Params: PostParams; Body: Partial<PostBody> }>('/posts/:id', 
    { preHandler: [server.authenticate, authorize(['god', 'admin', 'user']), authorizePostOwner] }, 
    updatePost
  );

  server.delete<{ Params: PostParams }>('/posts/:id', 
    { preHandler: [server.authenticate, authorize(['god', 'admin', 'user']), authorizePostOwner] }, 
    deletePost
  );
}

export default postRoutes;
