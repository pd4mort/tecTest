import { z } from 'zod';
import { UserRole } from '../types/userTypes';

// Define schema for user creation request body
/**
 * Schema for user creation request body.
 * @typedef {Object} UserBody
 * @property {string} email - The email address of the user.
 * @property {string} name - The name of the user.
 * @property {string} password - The password for the user.
 * @property {string} [role] - The role of the user (optional, defaults to 'user').
 */
export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum([UserRole.God, UserRole.Admin, UserRole.User]).default(UserRole.User),
});

// Define schema for user update request body
/**
 * Schema for user update request body.
 * @typedef {Object} Partial<UserBody>
 * @property {string} [email] - The email address of the user (optional).
 * @property {string} [name] - The name of the user (optional).
 * @property {string} [password] - The password for the user (optional).
 * @property {string} [role] - The role of the user (optional).
 */
export const updateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  name: z.string().min(1, 'Name is required').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
  role: z.enum([UserRole.God, UserRole.Admin, UserRole.User]).default(UserRole.User),
});

// Define schema for user ID parameters
/**
 * Schema for user ID parameters.
 * @typedef {Object} UserParams
 * @property {string} id - The UUID of the user.
 */
export const userParamsSchema = z.object({
  id: z.string().uuid('Invalid user ID format')
});



// Strong password
/*
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
*/