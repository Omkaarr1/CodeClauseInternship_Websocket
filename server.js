const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
let clients = []; // Array to store WebSocket connections of two clients

wss.on('connection', (ws) => {
  console.log('Client connected');

  // If there are already two clients connected, close the new connection
  if (clients.length >= 2) {
    console.log('Connection limit reached. Closing new connection.');
    ws.close();
    return;
  }

  // Store the WebSocket connection in the clients array
  clients.push(ws);

  // Check if there are two clients connected, and if so, establish messaging between them
  if (clients.length === 2) {
    const firstClientId = 0;
    const secondClientId = 1;

    // Send an initial message to each client to indicate the pairing
    clients[firstClientId].send(`You are connected to User 2`);
    clients[secondClientId].send(`You are connected to User 1`);
  }

  ws.on('message', (message) => {
    console.log('Received message from a client:', message);

    // Send the received message to the other client in the array
    const senderId = clients.indexOf(ws);
    const receiverIndex = senderId === 0 ? 1 : 0;
    const receiver = clients[receiverIndex];

    if (receiver && receiver.readyState === WebSocket.OPEN) {
      receiver.send(`User ${senderId+1}: ${message}`);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    // Remove the disconnected client from the clients array
    clients = clients.filter((client) => client.readyState === WebSocket.OPEN);
  });
});

console.log('WebSocket server running on ws://localhost:8080');
