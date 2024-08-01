import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { UserBody, UserParams, UserRole  } from '../types/userTypes';
import { JwtPayload } from '../types/authTypes';

/**
 * Creates a new user.
 * @param {FastifyRequest<{ Body: UserBody }>} request - Request containing user data.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response with the created user upon success.
 */
export async function createUser(request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply): Promise<void> {
  try {
    const { email, name, password, role } = request.body;

    // Create the user in the database
    const user = await prisma.user.create({
      data: { email, name, password, role }
    });

    // Respond with the created user
    reply.status(201).send(user);
  } catch (error) {
    console.error('Error creating user:', error);
    reply.status(500).send({ error: 'Error creating user' });
  }
}

/**
 * Retrieves a user by their ID.
 * @param {FastifyRequest<{ Params: UserParams }>} request - Request containing the user ID.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response with the requested user upon success.
 */
export async function getUserById(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply): Promise<void> {
  try {
    const { id } = request.params;

    // Fetch the user from the database
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      reply.status(404).send({ error: 'User not found' });
      return;
    }

    // Respond with the found user
    reply.send(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    reply.status(500).send({ error: 'Error retrieving user' });
  }
}

/**
 * Updates an existing user.
 * @param {FastifyRequest<{ Params: UserParams; Body: Partial<UserBody> }>} request - Request containing user data to update.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response with the updated user upon success.
 */
export async function updateUser(request: FastifyRequest<{ Params: UserParams; Body: Partial<UserBody> }>, reply: FastifyReply): Promise<void> {
  try {
    const { id } = request.params;
    const { email, name, password, role } = request.body;
    const user = request.user as JwtPayload; // Use JwtPayload type for authenticated user

    // Verify if the user has permission to update the resource
    if (user.role !== UserRole.God && user.role !== UserRole.Admin && user.id !== id) {
      reply.status(403).send({ error: 'Forbidden: You can only edit your own profile' });
      return;
    }

    // Users with 'user' role cannot change their own role
    const updateData: Partial<UserBody> = { email, name, password };
    if (user.role !== UserRole.God && user.role !== UserRole.Admin && role) {
      reply.status(403).send({ error: 'Forbidden: You cannot change your role' });
      return;
    }

    // If the user has the necessary permissions, they can update the role
    if (role) {
      updateData.role = role;
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    // Respond with the updated user
    reply.send(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    reply.status(500).send({ error: 'Error updating user' });
  }
}

/**
 * Deletes a user by their ID.
 * @param {FastifyRequest<{ Params: UserParams }>} request - Request containing the user ID to delete.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response with the user deletion status upon success.
 */
export async function deleteUser(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply): Promise<void> {
  try {
    const { id } = request.params;
    const user = request.user as JwtPayload;

    // Verify if the user has permission to delete the resource
    if (user.role !== UserRole.God && user.role !== UserRole.Admin && user.id !== id) {
      reply.status(403).send({ error: 'Forbidden: You can only delete your own profile' });
      return;
    }

    // Delete the user from the database
    await prisma.user.delete({ where: { id } });

    // Respond with no content
    reply.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    reply.status(500).send({ error: 'Error deleting user' });
  }
}
