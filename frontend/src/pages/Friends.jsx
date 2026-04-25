import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import { useNavigate } from "react-router-dom";

export default function Friends() {
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [search, setSearch] = useState("");

  const nav = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  if (!currentUser) return <h3>Login required</h3>;

  // 🔹 FETCH DATA
  const fetchData = async () => {
    try {
      const [reqRes, userRes, friendRes] = await Promise.all([
        API.get("/friends/requests/" + currentUser.id),
        API.get("/auth/users"),
        API.get("/friends/" + currentUser.id)
      ]);

      setRequests(reqRes.data);
      setUsers(userRes.data.filter(u => u.id !== currentUser.id));
      setFriends(friendRes.data);
    } catch (err) {
      console.log("Friends error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 SEND REQUEST
  const sendRequest = async (toId) => {
    try {
      await API.post("/friends/request", {
        fromId: currentUser.id,
        toId
      });
      alert("Request sent");
    } catch {
      alert("Already sent / error");
    }
  };

  // 🔹 ACCEPT REQUEST
  const acceptRequest = async (id) => {
    await API.post("/friends/accept", { requestId: id });
    fetchData();
  };

  // 🔹 CHECK FRIEND
  const isFriend = (id) => {
    return friends.some(f => f.user1_id === id || f.user2_id === id);
  };

  // 🔹 FILTER USERS
  const filteredUsers = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: 70 }}>
      <Topbar title="Friends" />

      <div style={{ padding: 12 }}>
        
        {/* 🔍 SEARCH */}
        <input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ccc",
            marginBottom: 15
          }}
        />

        {/* 📩 REQUESTS */}
        <h3>Friend Requests</h3>

        {requests.length === 0 ? (
          <p>No friend requests 😴</p>
        ) : (
          requests.map(r => (
            <div key={r.id} style={card}>
              <b>{r.full_name} (@{r.username})</b>
              <button onClick={() => acceptRequest(r.id)}>
                Accept
              </button>
            </div>
          ))
        )}

        {/* 👥 USERS */}
        <h3 style={{ marginTop: 20 }}>People</h3>

        {filteredUsers.length === 0 ? (
          <p>No results found</p>
        ) : (
          filteredUsers.map(u => (
            <div key={u.id} style={card}>
              <div>
                <b>{u.full_name}</b>
                <div style={{ color: "#777" }}>@{u.username}</div>
              </div>

              {isFriend(u.id) ? (
                <button onClick={() => nav("/chat/" + u.id)}>
                  Chat
                </button>
              ) : (
                <button onClick={() => sendRequest(u.id)}>
                  Add Friend
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <Navbar />
    </div>
  );
}

// 🔹 STYLE
const card = {
  background: "#fff",
  padding: 12,
  borderRadius: 12,
  marginBottom: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #eee"
};