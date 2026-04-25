import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const nav = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <h3>Please login</h3>;

  useEffect(() => {
    API.get("/posts").then(res => {
      setPosts(res.data.filter(p => p.author_id === user.id));
    });
  }, []);

  return (
    <div style={{ paddingBottom: 70 }}>
      <Topbar title="Profile" />

      {/* 🔹 USER INFO */}
      <div style={{ padding: 20, textAlign: "center" }}>
        <div style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "#ddd",
          margin: "auto"
        }} />

        <h3 style={{ marginTop: 10 }}>{user.full_name}</h3>
        <p>@{user.username}</p>
        <p style={{ color: "#666" }}>
          {user.city}, {user.state}
        </p>

        <button
          onClick={() => nav("/edit-profile")}
          style={{
            marginTop: 10,
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
            cursor: "pointer"
          }}
        >
          Edit Profile
        </button>
      </div>

      {/* 🔹 POSTS GRID */}
      <div style={{ padding: 10 }}>
        <h4>Your Posts</h4>

        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 5
            }}
          >
            {posts.map(p => (
              <div key={p.id}>
                {p.image ? (
                  <img
                    src={`https://volunteer-backend-yu6v.onrender.com/uploads/${p.image}`}
                    style={{
                      width: "100%",
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 6
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: 120,
                      background: "#eee",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Navbar />
    </div>
  );
}