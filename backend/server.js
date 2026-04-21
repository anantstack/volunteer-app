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

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ CORS
app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

// ✅ SOCKET INIT
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 👉 IMPORTANT EXPORT
export { io };

// ✅ uploads
const uploadsPath = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}
app.use("/uploads", express.static(uploadsPath));

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/friends", friendRoutes);

// ✅ USER SOCKET MAP (🔥 IMPORTANT)
let users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    users[userId] = socket.id;
  });

  // 🔥 MESSAGE
  socket.on("send_message", (data) => {
    const target = users[data.toUser];
    if (target) io.to(target).emit("receive_message", data);
  });

  // 🔥 TYPING (FIXED)
  socket.on("typing", ({ toUser }) => {
    const target = users[toUser];
    if (target) io.to(target).emit("typing");
  });

  // 🔥 SEEN (FIXED)
  socket.on("seen", ({ toUser }) => {
    const target = users[toUser];
    if (target) io.to(target).emit("seen");
  });

  // 🔥 FRIEND REQUEST REALTIME
  socket.on("new_friend_request", ({ toUser }) => {
    const target = users[toUser];
    if (target) io.to(target).emit("new_friend_request");
  });

  socket.on("disconnect", () => {
    for (let id in users) {
      if (users[id] === socket.id) {
        delete users[id];
      }
    }
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("🚀 Server running on", PORT));