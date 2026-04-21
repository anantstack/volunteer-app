import { io } from "socket.io-client";

const socket = io("https://volunteer-backend-yu6v.onrender.com", {
  transports: ["polling", "websocket"], // 🔥 FIX
  reconnection: true,
  reconnectionAttempts: 5,
  timeout: 10000
});

export default socket;