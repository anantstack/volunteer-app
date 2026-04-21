import { useEffect, useState } from "react";

export default function Topbar({ title }) {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.body.style.background = dark ? "#0f172a" : "#f1f5f9";
    document.body.style.color = dark ? "#fff" : "#000";

    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div
      style={{
        padding: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        background: dark ? "#1e293b" : "#fff",
        borderBottom: "1px solid #ddd"
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>

      <button
        onClick={() => setDark(!dark)}
        style={{
          border: "none",
          background: "#2563eb",
          color: "#fff",
          padding: "6px 12px",
          borderRadius: 8,
          cursor: "pointer"
        }}
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}