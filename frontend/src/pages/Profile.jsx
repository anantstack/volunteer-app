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
      const myPosts = res.data.filter(p => p.author_id === user.id);
      setPosts(myPosts);
    });
  }, []);

  return (
    <div style={{ paddingBottom: 60 }}>
      
      <Topbar /> {/* 🔥 NEW */}

      <div style={{ padding: 20 }}>
        <h3>Profile</h3>

        <p><b>Name:</b> {user.full_name}</p>
        <p><b>Username:</b> {user.username}</p>
        <p><b>City:</b> {user.city}</p>

        <h4>Your Posts</h4>

        {posts.map(p => (
          <div key={p.id}>
            <h5>{p.title}</h5>
            <p>{p.description}</p>
          </div>
        ))}
      </div>

      <Navbar />
    </div>
  );
}