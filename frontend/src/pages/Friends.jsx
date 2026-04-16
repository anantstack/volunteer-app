import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";

export default function Friends() {
  const [users, setUsers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    API.get("/auth/users").then(res => {
      const filtered = res.data.filter(u => u.id !== user.id);
      setUsers(filtered);
    });
  }, []);

  const sendRequest = async (id) => {
    await API.post("/friends/send", {
      senderId: user.id,
      receiverId: id
    });

    alert("Request sent");
  };

  return (
    <div style={{ padding: 10, paddingBottom: 60 }}>
      <h3>Add Friends</h3>

      {users.map(u => (
        <div key={u.id}>
          <b>{u.full_name}</b>
          <p>@{u.username}</p>

          <button onClick={() => sendRequest(u.id)}>
            Add Friend
          </button>
        </div>
      ))}

      <Navbar />
    </div>
  );
}