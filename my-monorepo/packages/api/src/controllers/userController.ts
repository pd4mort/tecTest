import { FastifyRequest, FastifyReply } from 'fastify';
import { UserBody, UserParams, UserRole  } from '../types/userTypes';
import { JwtPayload } from '../types/authTypes';
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from '../services/userService';
import { uploadProfilePictureService } from '../services/imageService';
import { notifyAllClients } from '@my-monorepo/services/notifications/websocketServer';


/**
 * Retrieves all users from the database.
 * @param {FastifyRequest} request - The Fastify request object.
 * @param {FastifyReply} reply - The Fastify reply object.
 * @returns {Promise<void>} - Sends a response with the list of all users or an error message.
 */
export async function getAllUsersController(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // Fetch all users from the service
    const users = await getAllUsers();

    // Send the list of users in the response
    reply.send(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    reply.status(500).send({ error: 'Error retrieving users' });
  }
}

/**
 * Creates a new user.
 * @param {FastifyRequest<{ Body: UserBody }>} request - Request containing user data.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response with the created user upon success.
 */
export async function createUserController(request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply): Promise<void> {
  try {
    // Validate and create user using the service
    const user = await createUser(request.body);

    // Respond with the created user
    reply.status(201).send(user);

    //notification
    const messageData = { text:'New member => ' + user.name };
    createNewMessage(messageData);
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
export async function getUserByIdController(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply): Promise<void> {
  try {
    const { id } = request.params;

    // Fetch the user using the service
    const user = await getUserById(id);

    // Respond with the found user
    reply.send(user);
  } catch (error) {
    console.error('Error retrieving user:', error);

    // Check if error is an instance of Error
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        reply.status(404).send({ error: 'User not found' });
      } else {
        reply.status(500).send({ error: 'Error retrieving user' });
      }
    } else {
      reply.status(500).send({ error: 'Unexpected error occurred' });
    }
  }
}

/**
 * Updates an existing user.
 * @param {FastifyRequest<{ Params: UserParams; Body: Partial<UserBody> }>} request - Request containing user data to update.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response with the updated user upon success.
 */
export async function updateUserController(request: FastifyRequest<{ Params: UserParams; Body: Partial<UserBody> }>, reply: FastifyReply): Promise<void> {
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
    if (user.role !== UserRole.God && user.role !== UserRole.Admin && role) {
      reply.status(403).send({ error: 'Forbidden: You cannot change your role' });
      return;
    }

    // Prepare the data for updating
    const updateData: Partial<UserBody> = { email, name, password };
    if (user.role === UserRole.God || user.role === UserRole.Admin) {
      updateData.role = role;
    }

    // Update the user in the database
    const updatedUser = await updateUser(id, updateData);

    // Respond with the updated user
    reply.send(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);

    // Handle error
    if (error instanceof Error) {
      reply.status(500).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unexpected error occurred' });
    }
  }
}

/**
 * Deletes a user by their ID.
 * @param {FastifyRequest<{ Params: UserParams }>} request - Request containing the user ID to delete.
 * @param {FastifyReply} reply - Server response.
 * @returns {Promise<void>} - Returns nothing directly, but sends the response with the user deletion status upon success.
 */
export async function deleteUserController(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply): Promise<void> {
  try {
    const { id } = request.params;
    const user = request.user as JwtPayload;

    // Verify if the user has permission to delete the resource
    if (user.role !== UserRole.God && user.role !== UserRole.Admin && user.id !== id) {
      reply.status(403).send({ error: 'Forbidden: You can only delete your own profile' });
      return;
    }

    // Use the service to delete the user
    await deleteUser(id);

    // Respond with no content
    reply.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);

    // Handle error
    if (error instanceof Error) {
      reply.status(500).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unexpected error occurred' });
    }
  }
}

/**
 * Handles uploading a profile picture.
 * @param {FastifyRequest} request - The Fastify request object.
 * @param {FastifyReply} reply - The Fastify reply object.
 * @returns {Promise<void>} - Sends a response with the URL of the uploaded image or an error message.
 */
export async function uploadProfilePictureController(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    const user = request.user as JwtPayload;
    
    // Handle the file upload using the service
    const imageUrl = await uploadProfilePictureService(user.id, request);

    // Respond with the image URL
    reply.send({ imageUrl });

  } catch (error) {
    console.error('Error uploading profile picture:', error);
    
    // Handle error
    if (error instanceof Error) {
      reply.status(500).send({ error: error.message });
    } else {
      reply.status(500).send({ error: 'Unexpected error occurred' });
    }
  }
}

//notifications
async function createNewMessage(messageData: { text: string; }) {
  
  notifyAllClients('New message: ' + messageData.text);
}