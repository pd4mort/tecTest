import fastify from 'fastify';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import config from './config/config';
import auth from './plugins/auth';
import fastifyMultipart from '@fastify/multipart';

const server = fastify();

// Register the plugin to handle multipart/form-data
server.register(fastifyMultipart);

// Register the authentication plugin
server.register(auth);

// Register routes
server.register(userRoutes, { prefix: config.apiPrefix });
server.register(postRoutes, { prefix: config.apiPrefix });

// Start the server
server.listen({ port: parseInt(config.port) }, (err, address) => {
  
  if (err) {
    
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
