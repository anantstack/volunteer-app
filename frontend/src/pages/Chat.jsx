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

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { id } = useParams();
  const otherUserId = id ? parseInt(id) : null;
  const [typing, setTyping] = useState(false);

  // ❌ अगर user या id नहीं
  if (!user) return <h3>Please login</h3>;
  if (!otherUserId) return <h3>Select a friend to chat</h3>;

  // 🔥 join socket
  useEffect(() => {
    socket.emit("join", user.id);
  }, []);

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
    socket.on("receive_message", (data) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => [...prev, data]);
      }
    });

    return () => socket.off("receive_message");
  }, [conversationId]);

  // 🔥 send message
  const send = async () => {
    if (!text.trim()) return;

    const msg = {
      conversationId,
      senderId: user.id,
      body: text
    };

    await API.post("/chat", msg);
    socket.emit("send_message", msg);

    setMessages(prev => [...prev, msg]); // instant UI
    setText("");
  };
  // typing send
  const handleTyping = () => {
  socket.emit("typing", { toUser: otherUserId });
  };

  // listen typing
  useEffect(() => {
  socket.on("typing", () => {
    setTyping(true);
    setTimeout(() => setTyping(false), 2000);
  });

  return () => socket.off("typing");
}, []);

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
      </div>

      {/* ✍ INPUT */}
      <div style={{ display: "flex", gap: 5 }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
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