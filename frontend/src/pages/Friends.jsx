import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";

export default function Friends() {
  const [requests, setRequests] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // ❌ अगर user नहीं
  if (!user) {
    return <h3 style={{ padding: 20 }}>Please login</h3>;
  }

  // 🔥 LOAD FUNCTION (SAFE)
  const load = () => {
    API.get("/friends/requests/" + user.id)
      .then(res => {
        console.log("FRIEND REQUESTS:", res.data); // 🔍 debug

        if (Array.isArray(res.data)) {
          setRequests(res.data);
        } else {
          setRequests([]); // 💥 crash fix
        }
      })
      .catch(err => {
        console.log("Friend error:", err);
        setRequests([]);
      });
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ ACCEPT
  const accept = async (id) => {
    try {
      await API.post("/friends/accept", { id });
      load();
    } catch (err) {
      console.log(err);
    }
  };

  // ❌ REJECT
  const reject = async (id) => {
    try {
      await API.post("/friends/reject", { id });
      load();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20, paddingBottom: 70 }}>
      <h3>Friend Requests</h3>

      {/* ✅ EMPTY STATE */}
      {!Array.isArray(requests) || requests.length === 0 ? (
        <p style={{ color: "#777" }}>No friend requests 😴</p>
      ) : (
        requests.map(r => (
          <div
            key={r.id}
            style={{
              background: "#fff",
              padding: 12,
              marginBottom: 10,
              borderRadius: 12,
              border: "1px solid #eee"
            }}
          >
            <b>{r.full_name}</b> (@{r.username})

            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              <button
                onClick={() => accept(r.id)}
                style={{
                  background: "#28a745",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                ✅ Accept
              </button>

              <button
                onClick={() => reject(r.id)}
                style={{
                  background: "#dc3545",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))
      )}

      <Navbar />
    </div>
  );
}