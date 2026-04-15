import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Login required");
        return;
      }

      if (!title || !description) {
        alert("Fill all fields");
        return;
      }

      const res = await API.post("/posts", {
        title,
        description,
        userId: user.id
      });

      console.log("Post response:", res.data);

      alert("Post created");

      nav("/feed");

    } catch (err) {
      console.log("Post error:", err);
      alert("Post failed");
    }
  };

  return (
    <div style={{ padding: 20, paddingBottom: 60 }}>
      <h3>Create Post</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button
        style={{
          background: "#28a745",
          color: "#fff",
          width: "100%"
        }}
        onClick={submit}
      >
        Post
      </button>

      <Navbar />
    </div>
  );
}