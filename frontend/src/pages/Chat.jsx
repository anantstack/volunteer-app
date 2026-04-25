import { useEffect, useState, useRef } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import socket from "../socket";
import { useParams } from "react-router-dom";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [typing, setTyping] = useState(false);

  const bottomRef = useRef();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const { id } = useParams();
  const otherUserId = parseInt(id);

  if (!user) return <h3>Login</h3>;

  // 🔹 JOIN SOCKET
  useEffect(() => {
    socket.emit("join", user.id);
  }, []);

  // 🔹 GET/CREATE CONVERSATION
  useEffect(() => {
    API.post("/chat/conversation", {
      user1: user.id,
      user2: otherUserId
    }).then(res => setConversationId(res.data.conversationId));
  }, [otherUserId]);

  // 🔹 LOAD MESSAGES
  useEffect(() => {
    if (!conversationId) return;

    API.get("/chat/" + conversationId).then(res => {
      setMessages(res.data);
    });
  }, [conversationId]);

  // 🔹 SOCKET LISTEN
  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => [...prev, data]);
      }
    });

    socket.on("typing", () => {
      setTyping(true);
      setTimeout(() => setTyping(false), 1000);
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
    };
  }, [conversationId]);

  // 🔹 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 SEND MESSAGE
  const send = async () => {
    if (!text.trim()) return;

    const msg = {
      conversationId,
      senderId: user.id,
      body: text,
      toUser: otherUserId
    };

    await API.post("/chat", msg);
    socket.emit("send_message", msg);

    setMessages(prev => [...prev, msg]);
    setText("");
  };

  return (
    <div style={{ padding: 10, paddingBottom: 70 }}>
      <h3>Chat</h3>

      {/* 🔹 MESSAGES */}
      <div style={{ minHeight: "65vh" }}>
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
                  borderRadius: 12,
                  maxWidth: "70%"
                }}
              >
                {m.body}
              </span>
            </div>
          );
        })}

        {typing && <p style={{ fontSize: 12 }}>Typing...</p>}

        <div ref={bottomRef} />
      </div>

      {/* 🔹 INPUT */}
      <div style={{ display: "flex", gap: 5 }}>
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            socket.emit("typing", { toUser: otherUserId });
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