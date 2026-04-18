import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../api";

export default function Navbar() {
  const nav = useNavigate();
  const [count, setCount] = useState(0);

useEffect(() => {
  API.get("/notifications/unread").then(res => {
    setCount(res.data.count || 0);
  });
}, []);
  

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        justifyContent: "space-around",
        padding: 12,
        background: "#fff",
        borderTop: "1px solid #ddd"
      }}
      
    >
      <div style={{ position: "relative" }}>
  <button onClick={() => nav("/chat")}>💬</button>

  {count > 0 && (
    <span style={{
      position: "absolute",
      top: -5,
      right: -5,
      background: "red",
      color: "#fff",
      borderRadius: "50%",
      padding: "2px 6px",
      fontSize: 10
    }}>
      {count}
    </span>
  )}
</div>
      {/* 🏠 HOME */}
      <button onClick={() => nav("/feed")}>🏠</button>

      {/* ➕ CREATE */}
      <button onClick={() => nav("/create")}>➕</button>

      {/* 💬 CHAT */}
      
      <button onClick={() => nav("/chat")}>💬</button>
      <button onClick={() => nav("/friends")}>👥</button>
      <button onClick={() => nav("/notifications")}>🔔</button>
    </div>
  );
}