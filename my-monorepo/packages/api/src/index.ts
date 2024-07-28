// src/index.ts
import fastify from 'fastify';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import config from './config/config';
import auth from './plugins/auth';

const server = fastify();

// Registrar el plugin de autenticación
server.register(auth);

// Registrar rutas
server.register(userRoutes, { prefix: config.apiPrefix });
server.register(postRoutes, { prefix: config.apiPrefix });

// Iniciar el servidor
server.listen({ port: config.port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
