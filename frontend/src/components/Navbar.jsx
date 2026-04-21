import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  const { pathname } = useLocation();

  const Item = ({ to, icon }) => (
    <button
      onClick={() => nav(to)}
      style={{
        flex: 1,
        background: "transparent",
        border: "none",
        fontSize: 20,
        opacity: pathname === to ? 1 : 0.5,
        cursor: "pointer"
      }}
    >
      {icon}
    </button>
  );

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        maxWidth: 400,
        display: "flex",
        borderTop: "1px solid #eee",
        background: "#fff",
        padding: 10
      }}
    >
      <Item to="/feed" icon="🏠" />
      <Item to="/create" icon="➕" />

      {/* 🔥 FIX: chat → users */}
      <Item to="/users" icon="💬" />

      <Item to="/friends" icon="👥" />
      <Item to="/notifications" icon="🔔" />
    </div>
  );
}