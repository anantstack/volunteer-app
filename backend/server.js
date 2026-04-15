import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import chatRoutes from "./routes/chat.js";
import "./config/db.js";
import dotenv from "dotenv";




dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running");
});
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chat", chatRoutes);


// 🔥 SOCKET LOGIC
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("User connected");

  // 🔥 user join
  socket.on("join", (userId) => {
    socket.userId = userId;

    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId);
    }

    io.emit("online_users", onlineUsers);
  });

  // 💬 message
  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  // ⌨️ typing
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });

  // ❌ disconnect
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(id => id !== socket.userId);
    io.emit("online_users", onlineUsers);
  });
});

server.listen(5000, () => console.log("Server running on 5000"));