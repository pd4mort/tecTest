import prisma from '@my-monorepo/db/src/prismaClient';
import { UserBody, UserParams } from '../types/userTypes';
import { createUserSchema, updateUserSchema, userParamsSchema } from '../validations/userValidation';

// Servicio para obtener todos los usuarios
export async function getAllUsers() {
  try {
    return await prisma.user.findMany();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Error fetching users');
  }
}

// Servicio para obtener un usuario por ID
export async function getUserById(id: string) {
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
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Error fetching user');
  }
}

// Servicio para crear un usuario
export async function createUser(userData: UserBody) {
  const parsed = createUserSchema.safeParse(userData);
  if (!parsed.success) {
    throw new Error('Invalid user data');
  }

  try {
    const { email, name, password, role } = parsed.data;
    return await prisma.user.create({
      data: { email, name, password, role }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Error creating user');
  }
}

// Servicio para actualizar un usuario
export async function updateUser(id: string, userData: Partial<UserBody>) {
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
    return await prisma.user.update({
      where: { id },
      data: { email, name, password, role }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Error updating user');
  }
}

// Servicio para eliminar un usuario
export async function deleteUser(id: string) {
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
