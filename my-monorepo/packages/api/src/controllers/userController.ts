// src/controllers/userController.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import prisma from '@my-monorepo/db/src/prismaClient';
import { UserParams, UserBody } from '../types/userTypes';
import { JwtPayload } from '../types/authTypes';
import { uploadImage, getImageUrl } from '@my-monorepo/services/firebase/imageService';

export async function getAllUsers(request: FastifyRequest, reply: FastifyReply) {
  const users = await prisma.user.findMany();
  reply.send(users);
}

export async function getUserById(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
  const { id } = request.params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    reply.status(404).send({ error: 'User not found' });
    return;
  }

  reply.send(user);
}

export async function createUser(request: FastifyRequest<{ Body: UserBody }>, reply: FastifyReply) {
  const { email, name, password, role } = request.body;

  const user = await prisma.user.create({
    data: { email, name, password, role }
  });

  reply.status(201).send(user);
}

export async function updateUser(request: FastifyRequest<{ Params: UserParams; Body: Partial<UserBody> }>, reply: FastifyReply) {
  const { id } = request.params;
  const { email, name, role } = request.body;
  const user = request.user as JwtPayload;

  if (user.role !== 'god' && user.role !== 'admin' && user.id !== id) {
    reply.status(403).send({ error: 'Forbidden: You can only edit your own profile' });
    return;
  }

  const updateData: Partial<UserBody> = { email, name };
  if (user.role !== 'god' && user.role !== 'admin') {
    delete updateData.role;
  } else {
    updateData.role = role;
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData
  });

  reply.send(updatedUser);
}

export async function deleteUser(request: FastifyRequest<{ Params: UserParams }>, reply: FastifyReply) {
  const { id } = request.params;

  await prisma.user.delete({ where: { id } });

  reply.status(204).send();
}

// image
export async function uploadProfilePicture(request: FastifyRequest, reply: FastifyReply) {
  try {
    const user = request.user as JwtPayload;
    
    // Obtener el archivo del cuerpo de la solicitud
    const data = await request.file();

    if (!data) {
      reply.status(400).send({ error: 'No file uploaded' });
      return;
    }

    // Usar Buffer para el contenido del archivo
    const fileBuffer = await data.toBuffer();

    const filename = await uploadImage(fileBuffer, `${user.id}-profile-picture`);
    const imageUrl = await getImageUrl(filename);

    await prisma.user.update({
      where: { id: user.id },
      data: { profilePicture: imageUrl },
    });

    reply.send({ imageUrl });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    reply.status(500).send({ error: 'Error uploading profile picture' });
  }
}
