import { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import { io } from "socket.io-client";
import socket from "../socket";

const [onlineUsers, setOnlineUsers] = useState([]);

useEffect(() => {
  socket.emit("join", currentUser.id);

  socket.on("user_online", (id) => {
    setOnlineUsers(prev => [...new Set([...prev, id])]);
  });

  socket.on("user_offline", ({ userId }) => {
    setOnlineUsers(prev => prev.filter(i => i !== userId));
  });

  return () => {
    socket.off("user_online");
    socket.off("user_offline");
  };
}, []);

const socket = io("https://volunteer-backend-yu6v.onrender.com");

export default function Users() {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const nav = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  if (!currentUser) return <h3>Please login</h3>;

  useEffect(() => {
    socket.emit("join", currentUser.id);
  }, []);

  useEffect(() => {
    API.get("/auth/users")
      .then(res => {
        const filtered = res.data.filter(u => u.id !== currentUser.id);
        setUsers(filtered);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    socket.on("online_users", setOnlineUsers);
    return () => socket.off("online_users");
  }, []);

  const openChat = (id) => nav("/chat/" + id);

  return (
    <div style={{ paddingBottom: 70 }}>
      <Topbar title="Users" />

      <div style={{ padding: 12 }}>
        {users.length === 0 ? (
          <p>No users found</p>
        ) : (
          users.map(u => (
            <div
              key={u.id}
              onClick={() => openChat(u.id)}
              style={{
                background: "#fff",
                padding: 14,
                borderRadius: 12,
                marginBottom: 10,
                border: "1px solid #eee",
                cursor: "pointer"
              }}
            >
              <b>
                {u.full_name} {onlineUsers.includes(u.id) && "🟢"}
              </b>
              <div style={{ color: "#777" }}>@{u.username}</div>
            </div>
          ))
        )}
      </div>

      <Navbar />
    </div>
  );
}