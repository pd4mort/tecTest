import argon2 from 'argon2';
import { JwtPayload } from '../types/authTypes';
import { FastifyInstance } from 'fastify';

/**
 * Hash a plaintext password
 * @param {string} password - Plaintext password
 * @returns {Promise<string>} - Hashed password
 * @throws {Error} - Throws an error if hashing fails
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Error hashing password');
  }
}

/**
 * Verify a plaintext password against a hashed password
 * @param {string} hashedPassword - Hashed password
 * @param {string} password - Plaintext password
 * @returns {Promise<boolean>} - True if password is valid
 * @throws {Error} - Throws an error if verification fails
 */
export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch (error) {
    console.error('Error verifying password:', error);
    throw new Error('Error verifying password');
  }
}

/**
 * Generate a JWT token
 * @param {JwtPayload} payload - Payload for the JWT
 * @param {FastifyInstance} fastify - Fastify instance to access jwt methods
 * @returns {string} - Signed JWT token
 * @throws {Error} - Throws an error if token generation fails
 */
export function generateToken(payload: JwtPayload, fastify: FastifyInstance): string {
  try {
    return fastify.jwt.sign(payload);
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Error generating token');
  }
}
