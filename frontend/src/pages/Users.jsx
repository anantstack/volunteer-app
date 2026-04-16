import { useEffect, useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";

const socket = io("https://volunteer-backend-yu6v.onrender.com");

export default function Users() {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const nav = useNavigate();

  // ✅ SAFE USER
  let currentUser = null;
  try {
    const storedUser = localStorage.getItem("user");
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    currentUser = null;
  }

  if (!currentUser) {
    return <h3 style={{ padding: 20 }}>Please login first</h3>;
  }

  useEffect(() => {
    socket.emit("join", currentUser.id);
  }, []);

  useEffect(() => {
    API.get("/auth/users")
      .then(res => {
        const filtered = res.data.filter(u => u.id !== currentUser.id);
        setUsers(filtered);
      })
      .catch(err => console.log("Users error:", err));
  }, []);

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
    <div style={{ padding: 10, paddingBottom: 60, maxWidth: 500, margin: "auto" }}>
      
      {/* 🔝 HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
      }}>
        <h3>Users</h3>

        <div style={{ display: "flex", gap: 10 }}>
          {/* 🔍 SEARCH */}
          <button onClick={() => nav("/search")}>🔍</button>

          {/* ⬅ BACK */}
          <button onClick={() => nav("/feed")}>⬅</button>
        </div>
      </div>

      {/* 👥 USERS LIST */}
      {users.map(u => (
        <div
          key={u.id}
          onClick={() => openChat(u.id)}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 10,
            borderRadius: 10,
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            cursor: "pointer"
          }}
        >
          <div style={{ fontWeight: "bold" }}>
            {u.full_name} {onlineUsers.includes(u.id) && "🟢"}
          </div>
          <div style={{ color: "#777" }}>@{u.username}</div>
        </div>
      ))}

      <Navbar />
    </div>
  );
}