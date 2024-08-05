import { FastifyRequest } from 'fastify';
import { uploadImage, getImageUrl } from '@my-monorepo/services/firebase/imageService';
import prisma from '@my-monorepo/db/src/prismaClient';
import { JwtPayload } from 'src/types/authTypes';
import { UserRole } from '../types/userTypes';

/**
 * Handles uploading a profile picture for a user.
 * @param {string} userId - The ID of the user uploading the profile picture.
 * @param {FastifyRequest} request - The Fastify request object containing the file.
 * @returns {Promise<string>} - Returns the URL of the uploaded image.
 * @throws {Error} - Throws an error if there is an issue uploading the image.
 */
export async function uploadProfilePictureService(userId: string, request: FastifyRequest): Promise<string> {
  try {
    const currentUser = request.user as JwtPayload;

    // Check if the current user is the owner or has the role of 'god'
    if (currentUser.id !== userId && currentUser.role !== UserRole.God) {
      throw new Error('Unauthorized: You do not have permission to perform this action');
    }

    // Obtain the file from the request
    const data = await request.file();

    if (!data) {
      throw new Error('No file uploaded');
    }

    // Use Buffer for file content
    const fileBuffer = await data.toBuffer();

    // Upload the image to the cloud storage
    const filename = await uploadImage(fileBuffer, `${userId}-profile-picture`);
    
    // Get the URL of the uploaded image
    const imageUrl = await getImageUrl(filename);

    // Update the user's profile picture in the database
    await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: imageUrl },
    });

    return imageUrl;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw new Error('Error uploading profile picture');
  }
}
