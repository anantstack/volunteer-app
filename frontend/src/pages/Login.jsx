import { useEffect, useState } from "react";
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

      localStorage.setItem("user", JSON.stringify(res.data));
      nav("/feed");

    } catch (err) {
      console.log("Login error:", err);
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>
        Volunteer App
      </h2>

      <input
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button
        style={{
          marginTop: 10,
          width: "100%",
          background: "#1877f2",
          color: "#fff"
        }}
        onClick={login}
      >
        Login
      </button>

      {/* ✅ NEW */}
     

      
      <p onClick={() => nav("/forgot")} style={{marginTop:15, color: "blue", textAlign: "center" }}>
      Forgot Password?
      </p>

<p onClick={() => nav("/register")} style={{ textAlign: "center" }}>
  Create New Account
</p>
    </div>
  );
}