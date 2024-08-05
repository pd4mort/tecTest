import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';

// Config Swagger
const swaggerOptions = {
  openapi: {
    info: {
      title: 'API Documentation',
      description: 'API Documentation for the monorepo',
      version: '1.0.0',
    },
    externalDocs: {
      url: 'https://example.com',
      description: 'Find more info here',
    },
    tags: [
      { name: 'user', description: 'User related endpoints' },
      { name: 'product', description: 'Product related endpoints' },
    ],
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
};

export async function setupSwagger(fastify: FastifyInstance) {
  fastify.register(FastifySwagger, {
    openapi: swaggerOptions.openapi
  });

  fastify.register(FastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'none',
      deepLinking: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
}
