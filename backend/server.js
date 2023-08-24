import 'dotenv/config'
import Express from 'express';
const app = Express();
const PORT = process.env.PORT || 5000;
import cors from 'cors';
import connectDB from './config/mongoose.js'
connectDB() //connect to database
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoute.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import path from 'path';

app.use(cors())
app.use(Express.json())     //telling server to accept json data from frontend

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// --------------------------deployment------------------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(Express.static(path.join(__dirname1, "/frontend/dist")));
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"))
    );
}
else {
    app.get("/", (req, res) =>
        res.send("API is running..")
    );
}
// --------------------------deployment------------------------------

//middlewares
app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT, () => console.log(`Server started listening on port ${PORT}`));

import { Server } from 'socket.io';

const io = new Server(server, {
    pingTimeout: 60000, //it wait this ms to recieve msg, then goes off to save bandwidth
    cors: {
        origin: 'http://localhost:5173'
    }
})

io.on('connection', (socket) => {
    // console.log('connected to socket.io')

    socket.on('setup', (userData) => {  //when frontend emitted setup
        socket.join(userData._id)
        socket.emit('connected')        //emit connected
    })

    socket.on('join room', (room) => {
        socket.join(room)
        console.log('User joined room :', room)
    })

    socket.on('typing', (room) => socket.in(room).emit("typing"))
    socket.on('stopTyping', (room) => socket.in(room).emit("stopTyping"))

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat
        if (!chat.users) return console.log('chat.users not defined')

        chat.users.forEach(user => {
            if (user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit("message received", newMessageReceived)
            //emit this message in in(user._id) room, which we joined in setup
        });
    })

    socket.off('setup', (userData) => {
        console.log(`${userData} disconnected.`)
        socket.leave(userData._id)
    })
})