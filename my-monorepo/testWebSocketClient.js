const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  console.log('Conectado al servidor WebSocket');
  // Enviar un mensaje de prueba
  ws.send('Hello Server!');
});

ws.on('message', function incoming(data) {
  console.log('Mensaje recibido:', data.toString());
});

ws.on('close', function close() {
  console.log('Desconectado del servidor WebSocket');
});

ws.on('error', function error(err) {
  console.error('Error de WebSocket:', err);
});
