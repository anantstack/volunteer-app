import { useState, useEffect } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Create() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file)); // 🔥 preview
    }
  };

  const submit = async () => {
    if (loading) return;

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

      setLoading(true);

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

      <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <input placeholder="Description" onChange={e => setDescription(e.target.value)} />

      <input type="date" onChange={e => setDate(e.target.value)} />
      <input placeholder="Venue" onChange={e => setVenue(e.target.value)} />

      {/* 📸 IMAGE PICK */}
      <input type="file" accept="image/*" onChange={handleImage} />

      {/* 🔥 PREVIEW */}
      {preview && (
        <img
          src={preview}
          style={{ width: "100%", marginTop: 10, borderRadius: 10 }}
        />
      )}

      <button onClick={submit} disabled={loading}>
        {loading ? "Posting..." : "Post"}
      </button>

      <Navbar />
    </div>
  );
}