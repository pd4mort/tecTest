import { z } from 'zod';

// Definir esquema para el cuerpo de la solicitud al crear un usuario
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.string().optional().default('user')
});

// Definir esquema para el cuerpo de la solicitud al actualizar un usuario
export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  role: z.string().optional()
});

// Definir esquema para los parámetros de la solicitud (por ejemplo, ID del usuario)
export const userParamsSchema = z.object({
  id: z.string().uuid('Invalid user ID format')
});


// Strong password
/*
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
*/