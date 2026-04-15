import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Create from "./pages/Create";
import Profile from "./pages/Profile";import Chat from "./pages/Chat";
import Users from "./pages/Users";





export default function App() {
  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        background: "#fff",
        minHeight: "100vh",
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden"
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/create" element={<Create />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/users" element={<Users />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}