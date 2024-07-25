import { z } from 'zod';

// Definir esquema para el cuerpo de la solicitud al crear un post
export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  authorId: z.string().uuid('Invalid author ID format')
});

// Definir esquema para el cuerpo de la solicitud al actualizar un post
export const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  authorId: z.string().uuid('Invalid author ID format').optional()
});

// Definir esquema para los parámetros de la solicitud (por ejemplo, ID del post)
export const postParamsSchema = z.object({
  id: z.string().uuid('Invalid post ID format')
});
