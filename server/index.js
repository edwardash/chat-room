import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import router from './router.js';
import cors from 'cors';
import { addUser, getUser, getUsersInRoom, removeUser } from './users.js';

const app = express();

app.use(cors());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const PORT = 5000;

app.use(router);

server.listen(PORT, () => {
    console.log('server started');
});


io.on('connection', (socket) => {
    console.log("new connection");


    socket.on('join', ({ name, room }, callback) => {
        console.log(name, room);

        const { error, user } = addUser({ id: socket.id, name, room });

        if (error) return callback(error);


        socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined!` })


        socket.join(user.room);
        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        callback();

    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', { user: user.name, text: message });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });


        callback();
    })


    socket.on('disconnect', () => {
        const user = removeUser(socket.id);


        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
        }

        console.log('user disconnected');
    })
});