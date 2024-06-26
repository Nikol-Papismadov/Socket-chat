import express from "express";
import cors from "cors";
import http from "http";
import { Server as socketIO } from "socket.io";
import { dirname } from "path";
import path from "path";
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __diename = dirname(__filename);

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new socketIO(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://localhost:5000",
        ],
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__diename, "public")));
const activeUsers = {};
debugger
const offlineUsers = {};
io.on("connection", (socket) => {
    socket.on("join", (username,accessToken,refreshToken) => {
        activeUsers[socket.id] = username;
        io.emit("activeUsers", Object.values(activeUsers));
        io.emit("offlineUsers", Object.values(offlineUsers));
        socket.broadcast.emit("userJoined", { userId: socket.id,username,accessToken:accessToken, refreshToken:refreshToken });
        console.log(`server:${username} Joined the chat`);
        
    });
    socket.on("disconnect", () => {
        const username = activeUsers[socket.id];
        delete activeUsers[socket.id];
        io.emit("activeUsers", Object.values(activeUsers));
        io.emit("offlineUsers", Object.values(offlineUsers));

        socket.broadcast.emit("userLeft", { username, userId: socket.id }); // Include username here
        console.log(`SERVER:${username} left the chat`);
    });
    
    socket.on("ChatMessage", (message) => {
        const username = activeUsers[socket.id];
        io.emit("message", { username, message });
        console.log(`${username}: ${message}`);
    });
    
});

app.get("/", (req, res) => {
    res.send("Welcome to our app");
});

app.get("/online-users", (req, res) => {
    res.json(Object.values(activeUsers));
});

server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
