import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import socket from "../socket";

export default function Friends() {
  const [requests, setRequests] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <h3>Please login</h3>;

  const load = () => {
    API.get("/friends/requests/" + user.id)
      .then(res => {
        setRequests(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setRequests([]));
  };

  useEffect(() => {
    load();

    socket.emit("join", user.id);

    socket.on("new_friend_request", load);
    socket.on("friend_request_accepted", load);

    return () => {
      socket.off("new_friend_request");
      socket.off("friend_request_accepted");
    };
  }, []);

  const accept = async (id) => {
    await API.post("/friends/accept", { id });
    load();
  };

  const reject = async (id) => {
    await API.post("/friends/reject", { id });
    load();
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Friend Requests</h3>

      {requests.length === 0 ? (
        <p>No friend requests 😴</p>
      ) : (
        requests.map(r => (
          <div key={r.id}>
            <b>{r.full_name}</b>
            <button onClick={() => accept(r.id)}>Accept</button>
            <button onClick={() => reject(r.id)}>Reject</button>
          </div>
        ))
      )}

      <Navbar />
    </div>
  );
}