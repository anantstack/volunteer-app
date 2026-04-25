import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const nav = useNavigate();

  const [form, setForm] = useState({
    phone: user.phone || "",
    city: user.city || "",
    state: user.state || ""
  });

  const update = async () => {
    try {
      await API.post("/auth/update", {
        id: user.id,
        ...form
      });

      alert("Updated");
      nav("/profile");
    } catch {
      alert("Error");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Profile</h2>

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />

      <input
        placeholder="City"
        value={form.city}
        onChange={e => setForm({ ...form, city: e.target.value })}
      />

      <input
        placeholder="State"
        value={form.state}
        onChange={e => setForm({ ...form, state: e.target.value })}
      />

      <button onClick={update}>Save</button>
    </div>
  );
}