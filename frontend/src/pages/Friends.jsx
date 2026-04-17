import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";

export default function Friends() {
  const [requests, setRequests] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const load = () => {
    API.get("/friends/requests/" + user.id)
      .then(res => setRequests(res.data));
  };

  useEffect(() => {
    load();
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
    <div style={{ padding: 20, paddingBottom: 60 }}>
      <h3>Friend Requests</h3>

      {requests.map(r => (
        <div key={r.id} style={{
          background: "#fff",
          padding: 10,
          marginBottom: 10,
          borderRadius: 10
        }}>
          <b>{r.full_name}</b> (@{r.username})

          <div style={{ marginTop: 5 }}>
            <button onClick={() => accept(r.id)}>✅ Accept</button>
            <button onClick={() => reject(r.id)}>❌ Reject</button>
          </div>
        </div>
      ))}

      <Navbar />
    </div>
  );
}