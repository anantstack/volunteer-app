import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";

export default function Notifications() {
  const [data, setData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    API.get("/notifications/" + user.id)
      .then(res => setData(res.data));
  }, []);

  return (
    <div style={{ padding: 20, paddingBottom: 60 }}>
      <h3>Notifications</h3>

      {data.map(n => (
        <div key={n.id} style={{
          background: "#fff",
          padding: 10,
          marginBottom: 10,
          borderRadius: 10
        }}>
          {n.text}
        </div>
      ))}

      <Navbar />
    </div>
  );
}