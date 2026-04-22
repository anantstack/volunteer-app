import { useState } from "react";
import { API } from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    First_Name: "",
    Last_Name: "",
    username: "",
    Password: "",
    Email: "",
    Phone: "",
    City: "",
    State: "",
    D_O_B: ""
  });

  const nav = useNavigate();

  const submit = async () => {
    await API.post("/auth/register", form);
    alert("Account created");
    nav("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Create Account</h3>

      {Object.keys(form).map(key => (
        <input
          key={key}
          placeholder={key}
          onChange={e => setForm({ ...form, [key]: e.target.value })}
        />
      ))}

      <button onClick={submit}>Register</button>
    </div>
  );
}