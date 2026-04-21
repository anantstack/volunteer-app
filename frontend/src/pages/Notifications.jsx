import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import socket from "../socket";

export default function Notifications() {
  const [data, setData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get("/notifications/" + user.id)
      .then(res => setData(res.data));

    socket.on("new_friend_request", () => {
      API.get("/notifications/" + user.id)
        .then(res => setData(res.data));
    });

    return () => socket.off("new_friend_request");
  }, []);

  return (
    <div style={{ padding: 20, paddingBottom: 60 }}>
      <h3>Notifications</h3>

      {data.map(n => (
        <div key={n.id}>
          {n.text}
        </div>
      ))}

      <Navbar />
    </div>
  );
}