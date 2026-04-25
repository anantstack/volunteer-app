import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Search from "./pages/Search";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Users from "./pages/Users";
import Friends from "./pages/Friends";
import Notifications from "./pages/Notifications";
import ForgotPassword from "./pages/ForgotPassword";

import  Register  from "./pages/Register";


export default function App() {

  useEffect(() => {
    fetch("https://volunteer-backend-yu6v.onrender.com");
  }, []);

  return (
    <BrowserRouter>
      <div style={{
        maxWidth: "400px",
        margin: "auto",
        background: "#fff",
        minHeight: "100vh",
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden"
      }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/search" element={<Search />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/users" element={<Users />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
