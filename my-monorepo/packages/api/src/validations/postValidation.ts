import { z } from 'zod';

// Define schema for the request body when creating a post
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  authorId: z.string().uuid('Invalid author ID format')
});

// Define schema for the request body when updating a post
export const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  authorId: z.string().uuid('Invalid author ID format').optional()
});

// Define schema for request parameters (e.g., post ID)
export const postParamsSchema = z.object({
  id: z.string().uuid('Invalid post ID format')
});
