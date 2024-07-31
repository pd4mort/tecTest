import { registerUser } from '../../src/controllers/authController';
import prisma from '@my-monorepo/db/src/prismaClient';
import { FastifyRequest, FastifyReply } from 'fastify';
import { UserBody } from '../../src/types/userTypes';

jest.mock('@my-monorepo/db/src/prismaClient', () => ({
  user: {
    create: jest.fn(),
  },
}));

describe('authController', () => {
  describe('registerUser', () => {
    const mockRequest: FastifyRequest<{ Body: UserBody }> = {
      body: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
        role: 'user',
      },
      server: {
        jwt: {
          sign: jest.fn().mockReturnValue('token'),
        },
      },
    } as unknown as FastifyRequest<{ Body: UserBody }>;

    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply;

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should create a new user and return a token', async () => {
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user',
        password: 'hashed-password',
      });

      await registerUser(mockRequest, mockReply);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: expect.any(String),
          role: 'user',
        },
      });

      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        user: {
          id: 'user-id',
          email: 'test@example.com',
          name: 'Test User',
          role: 'user',
        },
        token: 'token',
      });
    });

    it('should return 400 if email already exists', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValueOnce({
        code: 'P2002', // Prisma error code for unique constraint violation
      });

      await registerUser(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Email already exists' });
    });

    it('should return 500 if there is a database error', async () => {
      (prisma.user.create as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await registerUser(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({ error: 'Error registering user' });
    });
  });
});
