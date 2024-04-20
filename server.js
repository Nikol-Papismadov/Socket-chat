import express from "express";
import http from "http";
import { Server as socketIO } from "socket.io";
import{dirname} from "path";
import path from "path";
import { fileURLToPath } from 'url';


const PORT=process.env.PORT || 3000;

const __filename=fileURLToPath(import.meta.url);
const __diename=dirname(__filename);

const app=express();
const server=http.createServer(app);
const io=new socketIO(server,{
    cors:{
        origin:[
            "http://localhost:3000",
            "https://localhost:5173",
        ],
        methods:["GET","POST"]
    }
});

app.use(express.static(path.join(__diename,"public")))
const users={};


io.on("connection",(socket)=>{
    socket.on("join",(username)=>{
        users[socket.id]=username;
        io.emit("userJoined",{username,userId: socket.id});
        console.log(`server:${username} Joined the chat`)
    });
    socket.on("disconnect",()=>{
        const username=users[socket.id];
        delete users[socket.id];
        io.emit("userLeft",{username,userId:socket.id});
        console.log(`SERVER:${username} left the chat`)
    });
    socket.on("ChatMessage",(message)=>{
        const username=users[socket.id];
        io.emit("message",{username,message});
        console.log(`${username}: ${message}`)
    });
    socket.on("privateMessage",({recipientId,message})=>{
        const senderUsername=users[socket.id];
        const recipientSocket=io.sockets.sockets.get(recipientId);
        if(recipientSocket){
            recipientSocket.emit("privateMessage",{senderUsername,message});
        } 
    });
    socket.on("getAllUsers",()=>{
        const usersList=Object.values(users);
        socket.emit("allUsers",usersList);
        const message=`List of all users: ${usersList.join(", ")}`;
        socket.emit("PrivateMessage",{senderUsername:"SERVER",message});
    });
});


app.get("/",(req,res)=>{
    res.send("Welcome to our app");
})


server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})