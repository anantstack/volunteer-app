import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import socket from "../socket";
import { useParams } from "react-router-dom";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { id } = useParams();
  const otherUserId = parseInt(id);

  if (!user) return <h3>Login</h3>;

  useEffect(() => {
    socket.emit("join", user.id);
  }, []);

  useEffect(() => {
    API.post("/chat/conversation", {
      user1: user.id,
      user2: otherUserId
    }).then(res => setConversationId(res.data.conversationId));
  }, [otherUserId]);

  useEffect(() => {
    if (!conversationId) return;

    API.get("/chat/" + conversationId).then(res => {
      setMessages(res.data);
    });
  }, [conversationId]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => [...prev, data]);
        socket.emit("seen", { toUser: otherUserId });
      }
    });

    socket.on("typing", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1000);
    });

    socket.on("message_delivered", () => setStatus("✔ Delivered"));
    socket.on("message_seen", () => setStatus("✔✔ Seen"));

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("message_delivered");
      socket.off("message_seen");
    };
  }, [conversationId]);

  const send = async () => {
  if (!text) return;

  const msg = {
    conversationId,
    senderId: user.id,
    body: text,
    toUser: otherUserId
  };

  await API.post("/chat", msg);

  socket.emit("send_message", msg);

  // ✔ immediately set delivered
  setStatus("✔ Sent");

  setMessages(prev => [...prev, msg]);
  setText("");
};
  

  return (
    <div style={{ padding: 10 }}>
      <h3>Chat</h3>

      {messages.map((m, i) => (
        <div key={i}>{m.body}</div>
      ))}

      {typing && <p>typing...</p>}
      <p style={{ fontSize: 12 }}>{status}</p>

      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          socket.emit("typing", { toUser: otherUserId });
        }}
      />

      <button onClick={send}>Send</button>

      <Navbar />
    </div>
  );
}