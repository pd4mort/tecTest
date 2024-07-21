import fastify from 'fastify';
import userRoutes from './routes/userRoutes';
import postRoutes from './routes/postRoutes';

const server = fastify();

server.register(userRoutes);
server.register(postRoutes);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
