import { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Users() {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const nav = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // 🟢 JOIN SOCKET
  useEffect(() => {
    socket.emit("join", currentUser.id);
  }, []);

  // 👥 GET USERS
  useEffect(() => {
    API.get("/auth/users").then(res => {
      const filtered = res.data.filter(u => u.id !== currentUser.id);
      setUsers(filtered);
    });
  }, []);

  // 🟢 ONLINE USERS LISTENER
  useEffect(() => {
    socket.on("online_users", (data) => {
      setOnlineUsers(data);
    });

    return () => socket.off("online_users");
  }, []);

  const openChat = (userId) => {
    nav("/chat/" + userId);
  };

  return (
    <div style={{ padding: 10, paddingBottom: 60 }}>
      <h3>Users</h3>

      {users.map(u => (
        <div
          key={u.id}
          onClick={() => openChat(u.id)}
          style={{
            padding: 15,
            borderBottom: "1px solid #eee",
            cursor: "pointer"
          }}
        >
          <b>
            {u.full_name} {onlineUsers.includes(u.id) && "🟢"}
          </b>
          <p>@{u.username}</p>
        </div>
      ))}

      <Navbar />
    </div>
  );
}