// packages/services/src/websocketServer.ts
import WebSocket, { Server } from 'ws';

const wss = new Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Enviar un mensaje de bienvenida al cliente
  ws.send('Welcome to WebSocket server');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    
    // Ejemplo: retransmitir el mensaje a todos los clientes conectados
    wss.clients.forEach(client => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Función para enviar notificaciones a todos los clientes conectados
export function notifyAllClients(message: string) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export default wss;
