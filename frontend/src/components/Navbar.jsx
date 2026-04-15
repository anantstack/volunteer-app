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
      <button onClick={() => nav("/feed")}>🏠</button>
      <button onClick={() => nav("/create")}>➕</button>
      <button onClick={() => nav("/profile")}>👤</button>
      <button onClick={() => nav("/users")}>💬</button>
    </div>
  );
}