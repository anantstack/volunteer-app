import { useState, useEffect } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";

export default function Search() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    API.get("/auth/users").then(res => {
      setUsers(res.data);
    });
  }, []);

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(query.toLowerCase()) ||
    u.username.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ padding: 10, paddingBottom: 60, maxWidth: 500, margin: "auto" }}>
      <h3>Search</h3>

      <input
        placeholder="Search users..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 15 }}
      />

      {filtered.map(u => (
        <div key={u.id}>
          <b>{u.full_name}</b>
          <p>@{u.username}</p>
        </div>
      ))}

      <Navbar />
    </div>
  );
}