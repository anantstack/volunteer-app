import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

export default function Profile() {
  const [posts, setPosts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <h3>Please login</h3>;

  useEffect(() => {
    API.get("/posts").then(res => {
      setPosts(res.data.filter(p => p.author_id === user.id));
    });
  }, []);

  return (
    <div style={{ paddingBottom: 60 }}>
      <Topbar title="Profile" />

      <div style={{ padding: 20, textAlign: "center" }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#ddd",
          margin: "auto"
        }} />

        <h3>{user.full_name}</h3>
        <p>@{user.username}</p>
        <p>{user.city}</p>

        <button style={{ marginTop: 10, cursor: "pointer" }}>
          Edit Profile
        </button>
      </div>

      <div style={{ padding: 12 }}>
        <h4>Your Posts</h4>

        {posts.map(p => (
          <div key={p.id} style={{
            background: "#fff",
            padding: 10,
            borderRadius: 10,
            marginBottom: 10,
            border: "1px solid #eee"
          }}>
            <h5>{p.title}</h5>
            <p>{p.description}</p>
          </div>
        ))}
      </div>

      <Navbar />
    </div>
  );
}