import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const nav = useNavigate();

  const submit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    await API.post("/posts", {
      title,
      description,
      userId: user.id
    });

    nav("/feed");
  };

  return (
    <div style={{ padding: 20, paddingBottom: 60 }}>
      <h3>Create Post</h3>

      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" onChange={e => setDescription(e.target.value)} />

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