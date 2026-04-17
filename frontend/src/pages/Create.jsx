import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // ✅ FIX
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const submit = async () => {
    if (loading) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        alert("Login required");
        return;
      }

      if (!title || !description) {
        alert("Fill all fields");
        return;
      }

      setLoading(true);

      await API.post("/posts", {
        title,
        description,
        image,
        userId: user.id
      });

      alert("Post created");

      setTitle("");
      setDescription("");
      setImage("");

      nav("/feed");

    } catch (err) {
      console.log("Post error:", err);
      alert("Post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, paddingBottom: 60 }}>
      <h3>Create Post</h3>

      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <input placeholder="Image URL" value={image} onChange={e => setImage(e.target.value)} />

      <button onClick={submit}>
        {loading ? "Posting..." : "Post"}
      </button>

      <Navbar />
    </div>
  );
}