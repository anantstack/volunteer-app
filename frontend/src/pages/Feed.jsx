import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loadingLike, setLoadingLike] = useState({});

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchPosts = () => {
    API.get("/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.log("Feed error:", err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const likePost = async (postId) => {
    if (!user) return alert("Login required");

    if (loadingLike[postId]) return;

    try {
      setLoadingLike(prev => ({ ...prev, [postId]: true }));

      await API.post("/posts/like", {
        postId,
        userId: user.id
      });

      fetchPosts();
    } finally {
      setLoadingLike(prev => ({ ...prev, [postId]: false }));
    }
  };

  return (
    <div style={{ paddingBottom: 60 }}>
      
      <Topbar /> {/* 🔥 NEW */}

      <div style={{ padding: 10 }}>
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
            <div style={{ fontWeight: "bold" }}>
              {p.full_name} (@{p.username})
            </div>

            <h4>{p.title}</h4>
            <p>{p.description}</p>

            <button
              onClick={() => likePost(p.id)}
              disabled={loadingLike[p.id]}
              style={{
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: 8
              }}
            >
              ❤️ {p.likes}
            </button>
          </div>
        ))}
      </div>

      <Navbar />
    </div>
  );
}