import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 NEW
  const nav = useNavigate();

  const submit = async () => {
    if (loading) return; // 🔥 prevent multiple clicks

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

      setLoading(true); // 🔥 start loading

      const res = await API.post("/posts", {
        title,
        description
      });

      console.log("Post response:", res.data);

      alert("Post created");

      setTitle("");
      setDescription("");

      nav("/feed");

    } catch (err) {
      console.log("Post error:", err);
      alert("Post failed");
    } finally {
      setLoading(false); // 🔥 stop loading
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
        disabled={loading} // 🔥 disable button
        style={{
          background: "#28a745",
          color: "#fff",
          width: "100%",
          opacity: loading ? 0.6 : 1
        }}
        onClick={submit}
      >
        {loading ? "Posting..." : "Post"} {/* 🔥 UI feedback */}
      </button>

      <Navbar />
    </div>
  );
}