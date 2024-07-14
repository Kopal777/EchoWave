const express = require('express');
const  app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const {addUser, getUsersInRoom, removeUser} = require('./actions');

const server = http.createServer(app);
 
app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "https://echo-wave-2.vercel.app",
        methods: ["GET", "POST"]
    }
});
app.get('/', (req, res)=>{
    res.json("hello");
})

io.on("connection", (socket)=>{
    console.log(`User Connected - ${socket.id}`);
    const socketUserData = new Map();


    socket.on("join_room", (data)=>{

        const {username, room} = data;
        socket.join(data.room);
        console.log(`User with ID-${socket.id} has joined Room ${data.room}`)
        socketUserData.set(socket.id, {socketId: socket.id, username, room });
        const user = addUser(socket.id, username, room)

        io.to(room).emit('allUsersData', {
            room: room,
            users: getUsersInRoom(room)
        })

    })

    socket.on("send_message", (data)=>{
        console.log("Send message", data)
        socket.to(data.room).emit("recieve_message", data)
        
    })

    socket.on("disconnect", ()=> {
        console.log("User disconnected", socket.id);
        const user = removeUser(socket.id);
        if(user){
            io.to(user.room).emit('allUsersData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})
server.listen(3001, ()=>{
    console.log("Server running")
})