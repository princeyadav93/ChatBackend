import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
app.use(cors({
    origin: '*',
}));
const io = new Server(server, {
    cors: {
        origin: '*', // your frontend domain or Nuxt app
        methods: ["GET", "POST"],
    },
});

app.get('/', (req, res) => {
    res.send('Socket.io server is running');
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for a custom event from the client
    socket.on('chatMessage', (msg) => {
        console.log('Message received:', msg);

        // Emit the message to all connected clients
        io.emit('chatMessage', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Run the server
server.listen(3001, () => {
    console.log('Socket.io server is listening on port 3001');
});
