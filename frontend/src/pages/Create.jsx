import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const submit = async () => {
    if (loading) return;

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
      alert("Login required");
      return;
    }

    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("userId", user.id);
      formData.append("date", date);
      formData.append("venue", venue);
      if (image) formData.append("image", image);

      await API.post("/posts", formData);

      alert("Post created");
      nav("/feed");

    } catch (err) {
      console.log(err);
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

      {/* 📸 FILE UPLOAD */}
      <input type="file" onChange={e => setImage(e.target.files[0])} />

      <button onClick={submit} disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>

      <Navbar />
    </div>
  );
}