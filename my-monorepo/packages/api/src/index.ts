import fastify from 'fastify';

const server = fastify();

// Definir una ruta simple
server.get('/ping', async (request, reply) => {
  return 'pong\n';
});

// Iniciar el servidor utilizando la sintaxis recomendada
server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
