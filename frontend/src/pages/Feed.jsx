import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loadingLike, setLoadingLike] = useState({}); // 🔥 track per post

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchPosts = () => {
    API.get("/posts").then(res => setPosts(res.data));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const likePost = async (postId) => {
    // 🔥 prevent multiple click per post
    if (loadingLike[postId]) return;

    try {
      setLoadingLike(prev => ({ ...prev, [postId]: true }));

      const res = await API.post("/posts/like", {
        postId,
        userId: user.id
      });

      console.log(res.data);

      fetchPosts(); // refresh likes
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
          <h4>{p.title}</h4>
          <p style={{ color: "#555" }}>{p.description}</p>

          <button
            disabled={loadingLike[p.id]} // 🔥 disable button
            style={{
              background: "#f1f3f5",
              marginTop: 10,
              opacity: loadingLike[p.id] ? 0.6 : 1
            }}
            onClick={() => likePost(p.id)}
          >
            {loadingLike[p.id] ? "Liking..." : `❤️ ${p.likes || 0}`}
          </button>
        </div>
      ))}

      <Navbar />
    </div>
  );
}