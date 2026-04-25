import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/post.js";
import chatRoutes from "./routes/chat.js";
import notificationRoutes from "./routes/notification.js";
import friendRoutes from "./routes/friend.js";
import passwordRoutes from "./routes/password.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

// uploads
const uploadsPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}
app.use("/uploads", express.static(uploadsPath));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/password", passwordRoutes);

// SOCKET
const io = new Server(server, {
  cors: { origin: "*" }
});

app.set("io", io);

let users = {};

io.on("connection", (socket) => {

  socket.on("join", (userId) => {
    socket.join(String(userId));
    users[userId] = socket.id;
  });

  socket.on("send_message", (data) => {
    const target = users[data.toUser];
    if (target) {
      io.to(target).emit("receive_message", data);
      io.to(socket.id).emit("message_delivered");
    }
  });

  socket.on("typing", ({ toUser }) => {
    const target = users[toUser];
    if (target) io.to(target).emit("typing");
  });

  socket.on("seen", ({ toUser }) => {
    const target = users[toUser];
    if (target) io.to(target).emit("message_seen");
  });

  socket.on("disconnect", () => {
    for (let id in users) {
      if (users[id] === socket.id) {
        delete users[id];
      }
    }
  });
});

const PORT = process.env.PORT || 10000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Server running on", PORT);
});