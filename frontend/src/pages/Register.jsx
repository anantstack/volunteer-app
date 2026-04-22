import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    dob: ""
  });

  const submit = async () => {
    try {
      const res = await API.post("/auth/register", form);
      alert(res.data.message);
      nav("/");
    } catch (err) {
      console.log("ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Register failed ❌");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Create Account</h3>

      <input placeholder="Full Name" onChange={e => setForm({ ...form, full_name: e.target.value })} />
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <input placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Phone" onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="City" onChange={e => setForm({ ...form, city: e.target.value })} />
      <input placeholder="State" onChange={e => setForm({ ...form, state: e.target.value })} />
      <input placeholder="DOB" onChange={e => setForm({ ...form, dob: e.target.value })} />

      <button onClick={submit}>Register</button>
    </div>
  );
}