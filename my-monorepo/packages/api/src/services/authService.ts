import argon2 from 'argon2';
// Ya no necesitamos importar jwt directamente aquí
import { JwtPayload } from '../types/authTypes';
import { FastifyInstance } from 'fastify'; // Importamos el tipo de FastifyInstance

/**
 * Hash a plaintext password
 * @param {string} password - Plaintext password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password);
}

/**
 * Verify a plaintext password against a hashed password
 * @param {string} hashedPassword - Hashed password
 * @param {string} password - Plaintext password
 * @returns {Promise<boolean>} - True if password is valid
 */
export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  return await argon2.verify(hashedPassword, password);
}

/**
 * Generate a JWT token
 * @param {JwtPayload} payload - Payload for the JWT
 * @param {FastifyInstance} fastify - Fastify instance to access jwt methods
 * @returns {string} - Signed JWT token
 */
export function generateToken(payload: JwtPayload, fastify: FastifyInstance): string {
  return fastify.jwt.sign(payload);
}
