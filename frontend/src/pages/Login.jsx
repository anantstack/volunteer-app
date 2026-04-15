import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = async () => {
    try {
      const res = await API.post("/auth/login", {
        username,
        password
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      nav("/feed");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Volunteer App
      </h2>

      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={login}>Login</button>
    </div>
  );
}