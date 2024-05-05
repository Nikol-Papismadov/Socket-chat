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
const offlineUsers = {};
io.on("connection", (socket) => {
    socket.on("join", (username, accessToken, refreshToken) => {
        activeUsers[socket.id] = { username: username,accessToken: accessToken,refreshToken: refreshToken };
        io.emit("activeUsers", Object.values(activeUsers));
        io.emit("offlineUsers", Object.values(offlineUsers));
        socket.broadcast.emit("userJoined", { username });
        console.log(`User ${username} joined the chat`);
    });
    socket.on("disconnect", () => {
        
        const { username, accessToken, refreshToken } = activeUsers[socket.id];
        delete activeUsers[socket.id];
        io.emit("activeUsers", Object.values(activeUsers));
        io.emit("offlineUsers", Object.values(offlineUsers));
        socket.broadcast.emit("userLeft", { username });
        console.log(`User ${username} left the chat`);
    });

    socket.on("ChatMessage", (message) => {
        const username = activeUsers[socket.id];
        io.emit("message", { username, message });
        console.log(`${username}: ${message}`);
    });
});

server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
