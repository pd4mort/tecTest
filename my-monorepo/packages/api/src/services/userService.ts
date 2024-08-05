import prisma from '@my-monorepo/db/src/prismaClient';
import { UserBody, UserRole } from '../types/userTypes';
import { createUserSchema, updateUserSchema, userParamsSchema } from '../validations/userValidation';
import { hashPassword } from './authService';

/**
 * Service to fetch all users.
 * @returns {Promise<UserBody[]>} - Returns a promise that resolves with a list of users.
 * @throws {Error} - Throws an error if there is an issue fetching users.
 */
export async function getAllUsers(): Promise<UserBody[]> {
  try {
    const users = await prisma.user.findMany();
    return users.map(user => ({
      ...user,
      profilePicture: user.profilePicture ?? undefined,
      role: user.role as UserRole
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Error fetching users');
  }
}

/**
 * Service to create a new user.
 * @param {UserBody} userData - The data of the user to create.
 * @returns {Promise<UserBody>} - Returns a promise that resolves with the created user.
 * @throws {Error} - Throws an error if the user data is invalid or if there is an issue creating the user.
 */
export async function createUser(userData: UserBody): Promise<UserBody> {
  const parsed = createUserSchema.safeParse(userData);
  if (!parsed.success) {
    throw new Error('Invalid user data');
  }

  try {
    const { email, name, password, role } = parsed.data;
    const hashedPassword = await hashPassword(password);
    const createdUser = await prisma.user.create({
      data: { email, name, password: hashedPassword, role }
    });
    return {
      ...createdUser,
      profilePicture: createdUser.profilePicture ?? undefined,
      role: createdUser.role as UserRole
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
}

/**
 * Service to fetch a user by ID.
 * @param {string} id - The ID of the user.
 * @returns {Promise<UserBody>} - Returns a promise that resolves with the found user.
 * @throws {Error} - Throws an error if the user is not found or if there is an issue fetching the user.
 */
export async function getUserById(id: string): Promise<UserBody> {
  const parsed = userParamsSchema.safeParse({ id });
  if (!parsed.success) {
    throw new Error('Invalid user ID');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    if (!user) {
      throw new Error('User not found');
    }
    return {
      ...user,
      profilePicture: user.profilePicture ?? undefined,
      role: user.role as UserRole
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Error fetching user');
  }
}

/**
 * Service to update an existing user.
 * @param {string} id - The ID of the user to update.
 * @param {Partial<UserBody>} userData - The data to update the user with.
 * @returns {Promise<UserBody>} - Returns a promise that resolves with the updated user.
 * @throws {Error} - Throws an error if the user ID or data is invalid, or if there is an issue updating the user.
 */
export async function updateUser(id: string, userData: Partial<UserBody>): Promise<UserBody> {
  const parsedParams = userParamsSchema.safeParse({ id });
  if (!parsedParams.success) {
    throw new Error('Invalid user ID');
  }

  const parsedBody = updateUserSchema.safeParse(userData);
  if (!parsedBody.success) {
    throw new Error('Invalid user data');
  }

  try {
    const { email, name, password, role } = parsedBody.data;
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { email, name,password, role }
    });
    return{
      ...updatedUser,
      profilePicture: updatedUser.profilePicture ?? undefined,
      role: updatedUser.role as UserRole
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Error updating user');
  }
}

/**
 * Service to delete a user by ID.
 * @param {string} id - The ID of the user to delete.
 * @throws {Error} - Throws an error if the user ID is invalid or if there is an issue deleting the user.
 */
export async function deleteUser(id: string): Promise<void> {
  const parsed = userParamsSchema.safeParse({ id });
  if (!parsed.success) {
    throw new Error('Invalid user ID');
  }

  try {
    await prisma.user.delete({
      where: { id }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Error deleting user');
  }
}
