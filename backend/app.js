import dotenv from 'dotenv'
dotenv.config({path: '../.env'})
import express from 'express'
import cors from 'cors'
import connectDB from './db/connectdb.js'
import userRoutes from './routes/userRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import { notFound, errorHandler }from './middleware/errorMiddleware.js'
import { Server } from "socket.io";
import path from 'path'

const app = express()
const port = process.env.PORT || 3000
const frontend_url = process.env.FRONTEND_URL
const db_url = process.env.DB_URL

connectDB(db_url)

app.use(cors({
    origin: frontend_url,
    credentials:true,
}))
app.use(express.json())
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)

// --------------------Deployment-------------------------
const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1,'../frontend/dist')))
    app.get('*',(req, res)=>{
        res.sendFile(path.resolve(__dirname1, '../frontend', 'dist', 'index.html'))
    });
}
else{
    app.get('*',(req, res)=>{
        res.send("API is running successfully.")
    });
}
// --------------------Deployment-------------------------

app.use(notFound)
app.use(errorHandler)

const server = app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`)
})

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: frontend_url,
        credentials:true,
}})

io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    })

    socket.on('joinchat', (roomId) => {
        socket.join(roomId);
        console.log("User joined room" + roomId);
    })

    socket.on('typing', (room) => {
        socket.in(room).emit('typing');
    })

    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing');
    })

    socket.on('newmessage', (newMessageReceived) => {
        let chat = newMessageReceived.chat;
        if(!chat.users){
            return console.log("chat.users not defined");
        }
        chat.users.forEach((user) => {
            if(user._id == newMessageReceived.sender._id){
                return;
            }
            socket.in(user._id).emit("message received", newMessageReceived);
        })
    })

    socket.off('setup', () => {
        console.log("USER DISCONNECTED"+ userData);
        socket.leave(userData._id);
    });
})