import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";

export default function Feed() {
  const [posts, setPosts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  const fetchPosts = () => {
    API.get("/posts").then(res => setPosts(res.data));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const likePost = async (postId) => {
    await API.post("/posts/like", {
      postId,
      userId: user.id
    });

    fetchPosts();
  };

  return (
    <div style={{ padding: 10, paddingBottom: 60 }}>
      <h3>Feed</h3>

      {posts.map(p => (
        <div key={p.id}>
          <h4>{p.title}</h4>
          <p>{p.description}</p>

          <button onClick={() => likePost(p.id)}>
            ❤️ {p.likes || 0}
          </button>
        </div>
      ))}

      <Navbar />
    </div>
  );
}