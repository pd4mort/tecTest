import { PostBody, PostParams } from './postTypes';

export interface GetPostByIdParams {
  Params: PostParams;
}

export interface CreatePostBody {
  Body: PostBody;
}

export interface UpdatePostParams {
  Params: PostParams;
  Body: Partial<PostBody>;
}

export interface DeletePostParams {
  Params: PostParams;
}
