import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Search from "./pages/Search";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Users from "./pages/Users";
import Friends from "./pages/Friends";
import Notifications from "./pages/Notifications";

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        minHeight: "100vh",
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
        background: dark ? "#111" : "#fff",
        color: dark ? "#fff" : "#000"
      }}
    >
      {/* 🌙 DARK MODE BUTTON */}
      <div style={{ padding: 10, textAlign: "right" }}>
        <button onClick={() => setDark(!dark)}>
          {dark ? "☀️" : "🌙"}
        </button>
      </div>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/search" element={<Search />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/users" element={<Users />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}