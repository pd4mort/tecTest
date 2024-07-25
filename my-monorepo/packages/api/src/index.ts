import fastify from 'fastify';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';
import config from './config/config';

const server = fastify();

server.register(userRoutes, { prefix: config.apiPrefix });
server.register(postRoutes, { prefix: config.apiPrefix });

server.listen({ port: config.port }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
