import { io } from "socket.io-client";

const socket = io("https://volunteer-backend-yu6v.onrender.com", {
  transports: ["polling", "websocket"]
});

export default socket;