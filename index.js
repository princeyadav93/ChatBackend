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
        origin: '*',
        methods: ["GET", "POST"],
    },
});

app.get('/', (req, res) => {
    res.send('Socket.io server is running');
});

const messages = []

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    io.to(socket.id).emit('loaded', socket.id);

    socket.on('joinRoom', (room) => {
        socket.join(room);
        const filteredMessages = messages.filter((msg) => msg.room === room)
        io.to(room).emit('prevMessages', filteredMessages);
    });

    socket.on('chatMessage', ({ room, message, senderName }) => {
        messages.push({
            room, message, senderName
        })
        io.to(room).emit('chatMessage', { message, sender: socket.id, senderName: senderName });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(3001, () => {
    console.log('Socket.io server is listening on port 3001');
});
