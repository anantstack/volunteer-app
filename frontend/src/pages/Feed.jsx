import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loadingLike, setLoadingLike] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchPosts = () => {
    API.get("/posts").then(res => setPosts(res.data));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const likePost = async (postId) => {
    if (!user) {
      alert("Login required");
      return;
    }

    if (loadingLike[postId]) return;

    try {
      setLoadingLike(prev => ({ ...prev, [postId]: true }));

      await API.post("/posts/like", {
        postId,
        userId: user.id
      });

      fetchPosts();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingLike(prev => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div style={{ padding: 10, paddingBottom: 60 }}>
      <h3>Feed</h3>

      {posts.map(p => (
        <div
          key={p.id}
          style={{
            background: "#fff",
            padding: 15,
            marginBottom: 12,
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}
        >
          {/* 👤 USER */}
          <div style={{ fontWeight: "bold", marginBottom: 5 }}>
            {p.full_name || "Unknown"} (@{p.username})
          </div>

          {/* 📄 POST */}
          <h4>{p.title}</h4>
          <p style={{ color: "#555" }}>{p.description}</p>

          {/* ❤️ LIKE BUTTON */}
          <button
            disabled={loadingLike[p.id]}
            style={{
              background: "#ff4d4f",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: 8,
              marginTop: 10,
              cursor: "pointer",
              opacity: loadingLike[p.id] ? 0.6 : 1
            }}
            onClick={() => likePost(p.id)}
          >
            {loadingLike[p.id] ? "..." : `❤️ ${p.likes || 0}`}
          </button>

          {/* 💬 COMMENT + SHARE UI */}
          <div style={{ marginTop: 10, fontSize: 14, color: "#777" }}>
            💬 Comment &nbsp;&nbsp; 🔗 Share
          </div>
        </div>
      ))}

      <Navbar />
    </div>
  );
}