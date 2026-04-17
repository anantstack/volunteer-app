import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loadingLike, setLoadingLike] = useState({});
  const nav = useNavigate();

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
    <div style={{ padding: 10, paddingBottom: 60, maxWidth: 500, margin: "auto" }}>

      {/* 🔥 HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
      }}>
        <h3>Feed</h3>

        <div style={{ display: "flex", gap: 10 }}>
          {/* 🔍 SEARCH */}
          <button onClick={() => nav("/search")}>
            🔍
          </button>

          {/* 👥 USERS */}
          <button onClick={() => nav("/users")}>
            👥
          </button>
        </div>
      </div>

      {/* 📄 POSTS */}
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
    <div style={{ fontWeight: "bold", marginBottom: 5 }}>
      {p.full_name} (@{p.username})
    </div>

    <h4>{p.title}</h4>
    <p style={{ color: "#555" }}>{p.description}</p>

    {/* 🆕 DATE + VENUE */}
    {p.date && <p>📅 {p.date}</p>}
    {p.venue && <p>📍 {p.venue}</p>}

    {/* 🖼 IMAGE */}
    {p.image && (
      <img
        src={p.image}
        style={{ width: "100%", borderRadius: 10, marginTop: 10 }}
      />
    )}

    <button
      disabled={loadingLike[p.id]}
      style={{
        background: "#ff4d4f",
        color: "#fff",
        border: "none",
        padding: "6px 12px",
        borderRadius: 8,
        marginTop: 10
      }}
      onClick={() => likePost(p.id)}
    >
      {loadingLike[p.id] ? "..." : `❤️ ${p.likes || 0}`}
    </button>
  </div>
))}
      <Navbar />
    </div>
  );
}