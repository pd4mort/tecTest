import fastify from 'fastify';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import config from './config/config';
import auth from './plugins/auth';
import fastifyMultipart from '@fastify/multipart';

const server = fastify();

// Registrar el plugin para manejar multipart/form-data
server.register(fastifyMultipart);

// Registrar el plugin de autenticación
server.register(auth);

// Registrar rutas
server.register(userRoutes, { prefix: config.apiPrefix });
server.register(postRoutes, { prefix: config.apiPrefix });

// Iniciar el servidor
server.listen({ port: parseInt(config.port) }, (err, address) => {
  
  if (err) {
    
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
