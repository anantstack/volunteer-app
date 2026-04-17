import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import chatRoutes from "./routes/chat.js";
import notificationRoutes from "./routes/notification.js";
import friendRoutes from "./routes/friend.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🔥 STATIC IMAGE SERVE (IMPORTANT)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// 🔥 ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/friends", friendRoutes);


// 🔥 SOCKET
let onlineUsers = [];

io.on("connection", (socket) => {

  socket.on("join", (userId) => {
    socket.userId = userId;
    if (!onlineUsers.includes(userId)) onlineUsers.push(userId);
    io.emit("online_users", onlineUsers);
  });

  socket.on("send_message", (data) => {
    io.emit("receive_message", data);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("typing");
  });

  socket.on("seen", () => {
    socket.broadcast.emit("seen");
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter(id => id !== socket.userId);
    io.emit("online_users", onlineUsers);
  });
});


// 🔥 START SERVER
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("🚀 Server running on", PORT));