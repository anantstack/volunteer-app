import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ title }) {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    document.body.style.background = dark ? "#0f172a" : "#f1f5f9";
    document.body.style.color = dark ? "#fff" : "#000";

    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const logout = () => {
    localStorage.removeItem("user");
    nav("/");
    window.location.reload();
  };

  return (
    <div
      style={{
        padding: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: dark ? "#1e293b" : "#fff",
        borderBottom: "1px solid #ddd",
        position: "relative"
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>

      <div style={{ display: "flex", gap: 10 }}>
        {/* 🌙 DARK MODE */}
        <button
          onClick={() => setDark(!dark)}
          style={btn}
        >
          {dark ? "☀️" : "🌙"}
        </button>

        {/* ☰ MENU */}
        <button
          onClick={() => setOpen(!open)}
          style={btn}
        >
          ☰
        </button>
      </div>

      {/* 🔽 DROPDOWN */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: 50,
            right: 10,
            background: dark ? "#1e293b" : "#fff",
            color: dark ? "#fff" : "#000",
            borderRadius: 10,
            padding: 10,
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            minWidth: 140
          }}
        >
          <div style={menuItem} onClick={() => nav("/profile")}>
            👤 Profile
          </div>

          <div style={menuItem} onClick={() => nav("/edit-profile")}>
            ✏️ Edit Profile
          </div>

          <div style={menuItem} onClick={logout}>
            🚪 Logout
          </div>
        </div>
      )}
    </div>
  );
}

// 🔹 styles
const btn = {
  border: "none",
  background: "#2563eb",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 8,
  cursor: "pointer"
};

const menuItem = {
  padding: 8,
  cursor: "pointer",
  borderBottom: "1px solid #ddd"
};