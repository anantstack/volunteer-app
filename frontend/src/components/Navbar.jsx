import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();

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
      {/* 🏠 HOME */}
      <button onClick={() => nav("/feed")}>🏠</button>

      {/* ➕ CREATE */}
      <button onClick={() => nav("/create")}>➕</button>

      {/* 💬 CHAT */}
      <button onClick={() => nav("/chat")}>💬</button>
    </div>
  );
}