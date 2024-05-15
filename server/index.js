const express = require('express');
const  app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const server = http.createServer(app);
 
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket)=>{
    console.log(`User Connected - ${socket.id}`);

    socket.on("join_room", (data)=>{
        socket.join(data);
        console.log(`User with ID-${socket.id} has joined Room ${data}`)
    })

    socket.on("send_message", (data)=>{
        socket.to(data.room).emit("recieve_message", data)
    })

    socket.on("disconnect", ()=> {
        console.log("User disconnected", socket.id);
    })
})
server.listen(3001, ()=>{
    console.log("Server running")
})