import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [image, setImage] = useState(null);
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

      // 🔥 FORM DATA (IMPORTANT)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("date", date);
      formData.append("venue", venue);
      formData.append("userId", user.id);
      if (image) formData.append("image", image);

      await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("Post created");

      setTitle("");
      setDescription("");
      setDate("");
      setVenue("");
      setImage(null);

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

      <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      <input placeholder="Venue" value={venue} onChange={e => setVenue(e.target.value)} />

      {/* 🖼 FILE UPLOAD */}
      <input type="file" onChange={e => setImage(e.target.files[0])} />

      <button
        disabled={loading}
        style={{
          background: "#28a745",
          color: "#fff",
          width: "100%",
          marginTop: 10
        }}
        onClick={submit}
      >
        {loading ? "Posting..." : "Post"}
      </button>

      <Navbar />
    </div>
  );
}