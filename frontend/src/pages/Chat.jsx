import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("https://volunteer-backend-yu6v.onrender.com");

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [typing, setTyping] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { id } = useParams();
  const otherUserId = id ? parseInt(id) : null;

  // ❌ safety
  if (!user) return <h3>Please login</h3>;
  if (!otherUserId) return <h3>Select a friend to chat</h3>;

  // 🔥 join socket
  useEffect(() => {
    socket.emit("join", user.id);
  }, [user.id]);

  // 🔥 create/get conversation
  useEffect(() => {
    API.post("/chat/conversation", {
      user1: user.id,
      user2: otherUserId
    }).then(res => {
      setConversationId(res.data.conversationId);
    });
  }, [otherUserId]);

  // 🔥 fetch messages
  useEffect(() => {
    if (!conversationId) return;

    API.get("/chat/" + conversationId).then(res => {
      setMessages(res.data);
    });
  }, [conversationId]);

  // 🔥 receive message realtime
  useEffect(() => {
    const handleReceive = (data) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => [...prev, data]);
      }
    };

    socket.on("receive_message", handleReceive);

    return () => socket.off("receive_message", handleReceive);
  }, [conversationId]);

  // 🔥 typing listener
  useEffect(() => {
    const handleTyping = () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1500);
    };

    socket.on("typing", handleTyping);

    return () => socket.off("typing", handleTyping);
  }, []);

  // 🔥 send message
  const send = async () => {
    if (!text.trim() || !conversationId) return;

    const msg = {
      conversationId,
      senderId: user.id,
      body: text
    };

    try {
      await API.post("/chat", msg);
      socket.emit("send_message", msg);

      setMessages(prev => [...prev, msg]);
      setText("");
    } catch (err) {
      console.log("Send error:", err);
    }
  };

  // 🔥 typing emit
  const emitTyping = () => {
    socket.emit("typing", { toUser: otherUserId });
  };

  return (
    <div style={{ padding: 10, paddingBottom: 70 }}>
      <h3>Chat</h3>

      {/* 📨 MESSAGES */}
      <div style={{ minHeight: "60vh" }}>
        {messages.map((m, i) => {
          const isMe =
            m.sender_id === user.id || m.senderId === user.id;

          return (
            <div
              key={i}
              style={{
                textAlign: isMe ? "right" : "left",
                marginBottom: 10
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  background: isMe ? "#007bff" : "#eee",
                  color: isMe ? "#fff" : "#000",
                  padding: "8px 12px",
                  borderRadius: 12
                }}
              >
                {m.body}
              </span>
            </div>
          );
        })}

        {/* ✍️ typing indicator */}
        {typing && (
          <p style={{ fontSize: 12, color: "#777" }}>
            typing...
          </p>
        )}
      </div>

      {/* ✍ INPUT */}
      <div style={{ display: "flex", gap: 5 }}>
        <input
          value={text}
          onChange={e => {
            setText(e.target.value);
            emitTyping(); // 🔥 FIXED
          }}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={send}
          style={{
            background: "#007bff",
            color: "#fff",
            border: "none",
            padding: "10px 15px",
            borderRadius: 8
          }}
        >
          Send
        </button>
      </div>

      <Navbar />
    </div>
  );
}