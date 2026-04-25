import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    API.get("/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.log("Feed error:", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const likePost = async (id) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return alert("Login required");

    try {
      await API.post("/posts/like", {
        postId: id,
        userId: user.id
      });
      fetchPosts();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ paddingBottom: 70, background: "#f5f5f5", minHeight: "100vh" }}>
      <Topbar title="Feed" />

      <div style={{ padding: 10 }}>
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map(p => (
            <div
              key={p.id}
              style={{
                background: "#fff",
                marginBottom: 16,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
              }}
            >
              {/* 🔹 USER HEADER */}
              <div style={{ padding: 12, fontWeight: 600 }}>
                {p.full_name} (@{p.username})
              </div>

              {/* 🔹 IMAGE */}
              {p.image && (
                <img
                  src={`https://volunteer-backend-yu6v.onrender.com/uploads/${p.image}`}
                  alt="post"
                  style={{
                    width: "100%",
                    height: 300,
                    objectFit: "cover"
                  }}
                />
              )}

              {/* 🔹 ACTION BUTTONS */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  padding: "10px 0",
                  fontSize: 18
                }}
              >
                <span
                  onClick={() => likePost(p.id)}
                  style={{ cursor: "pointer" }}
                >
                  ❤️ {p.likes || 0}
                </span>

                <span style={{ cursor: "pointer" }}>
                  💬 Comment
                </span>

                <span style={{ cursor: "pointer" }}>
                  📤 Share
                </span>
              </div>

              {/* 🔹 CONTENT */}
              <div style={{ padding: "0 12px 10px" }}>
                <h4 style={{ margin: "5px 0" }}>{p.title}</h4>
                <p style={{ color: "#555", margin: "5px 0" }}>
                  {p.description}
                </p>

                {/* 🔹 DATE + LOCATION */}
                <div style={{ color: "#888", fontSize: 12 }}>
                  {p.date && `📅 ${new Date(p.date).toLocaleDateString()}`}
                  {p.venue && ` • 📍 ${p.venue}`}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Navbar />
    </div>
  );
}