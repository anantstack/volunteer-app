import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    API.get("/posts").then(res => {
      const myPosts = res.data.filter(p => p.author_id === user.id);
      setPosts(myPosts);
    });
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
        <div key={p.id}>
          <h5>{p.title}</h5>
          <p>{p.description}</p>
        </div>
      ))}

      <Navbar />
    </div>
  );
}