import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    API.get("/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const likePost = async (id) => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) return alert("Login required");

    await API.post("/posts/like", {
      postId: id,
      userId: user.id
    });

    fetchPosts();
  };

  return (
    <div style={{ paddingBottom: 70 }}>
      <Topbar title="Feed" />

      <div style={{ padding: 12 }}>
        {posts.map(p => (
          <div
            key={p.id}
            style={{
              background: "#fff",
              padding: 14,
              marginBottom: 12,
              borderRadius: 16,
              border: "1px solid #eee"
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {p.full_name} (@{p.username})
            </div>

            <h4>{p.title}</h4>
            <p style={{ color: "#555" }}>{p.description}</p>

            {/* ✅ IMAGE */}
            {p.image && (
              <img
                src={`https://volunteer-backend-yu6v.onrender.com/uploads/${p.image}`}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  marginTop: 8
                }}
              />
            )}

            {/* ✅ CLEAN DATE */}
            <div style={{ color: "#888", fontSize: 12 }}>
              {p.date && `📅 ${new Date(p.date).toLocaleDateString()}`}
              {p.venue && ` • 📍 ${p.venue}`}
            </div>

            <div style={{ marginTop: 10 }}>
              <button onClick={() => likePost(p.id)}>
                ❤️ {p.likes || 0}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Navbar />
    </div>
  );
}