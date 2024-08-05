import WebSocket, { Server } from 'ws';

const wss = new Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send a welcome message to the client
  ws.send('Welcome to WebSocket server');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
    
    // Example: Broadcast the received message to all connected clients except the sender
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

/**
 * Function to notify all connected clients with a message.
 * @param {string} message - Message to send to all clients.
 */
export function notifyAllClients(message: string) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

export default wss;
