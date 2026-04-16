import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";

export default function Profile() {
  const [posts, setPosts] = useState([]);

  // ✅ SAFE USER
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  // ❌ अगर login नहीं
  if (!user) {
    return <h3>Please login first</h3>;
  }

  useEffect(() => {
    API.get("/posts")
      .then(res => {
        const myPosts = res.data.filter(p => p.author_id === user.id);
        setPosts(myPosts);
      })
      .catch(err => console.log("Profile error:", err));
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 20, paddingBottom: 60 }}>
      <h3>Profile</h3>

      <p><b>Name:</b> {user.full_name}</p>
      <p><b>Username:</b> {user.username}</p>
      <p><b>City:</b> {user.city}</p>

      <button onClick={logout}>Logout</button>

      <h4>Your Posts</h4>

      {posts.map(p => (
        <div key={p.id} style={{
          background: "#fff",
          padding: 10,
          marginTop: 10,
          borderRadius: 10
        }}>
          <h5>{p.title}</h5>
          <p>{p.description}</p>
        </div>
      ))}

      <Navbar />
    </div>
  );
}