// packages/services/src/websocketServer.ts
import WebSocket, { Server } from 'ws';

const wss = new Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message => ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

export default wss;
