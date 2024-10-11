const WebSocket = require('ws');

let port = process.env || 9090;
const server = new WebSocket.Server({ port  });

server.on('connection', socket => {
    console.log('Client connected');

    socket.on('sendMessage', message => {
        console.log(`Received: ${message}`);
        socket.emit('receiveMessage' , message);
    });

    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);
