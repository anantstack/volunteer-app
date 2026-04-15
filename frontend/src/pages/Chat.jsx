import { useEffect, useState } from "react";
import { API } from "../api";
import Navbar from "../components/Navbar";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io("http://localhost:5000");

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [typingUser, setTypingUser] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const { id } = useParams();
  const otherUserId = parseInt(id);

  // 🟢 JOIN SOCKET
  useEffect(() => {
    socket.emit("join", user.id);
  }, []);

  // 🔥 CREATE / GET CONVERSATION
  useEffect(() => {
    API.post("/chat/conversation", {
      user1: user.id,
      user2: otherUserId
    }).then(res => {
      setConversationId(res.data.conversationId);
    });
  }, [otherUserId]);

  // 📄 FETCH MESSAGES
  useEffect(() => {
    if (!conversationId) return;

    API.get("/chat/" + conversationId).then(res => {
      setMessages(res.data);
    });
  }, [conversationId]);

  // 💬 REALTIME MESSAGE
  useEffect(() => {
    socket.on("receive_message", (data) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => [...prev, data]);
      }
    });

    return () => socket.off("receive_message");
  }, [conversationId]);

  // ⌨️ TYPING LISTENER
  useEffect(() => {
    socket.on("typing", (data) => {
      setTypingUser(data.user);
      setTimeout(() => setTypingUser(""), 2000);
    });

    return () => socket.off("typing");
  }, []);

  // 📤 SEND MESSAGE
  const send = async () => {
    if (!text || !conversationId) return;

    const msg = {
      conversationId,
      senderId: user.id,
      body: text
    };

    await API.post("/chat", msg);

    socket.emit("send_message", {
      ...msg,
      sender_id: user.id
    });

    setText("");
  };

  return (
    <div style={{ padding: 10, paddingBottom: 60 }}>
      <h3>Chat</h3>

      <div style={{ minHeight: "300px" }}>
        {messages.map((m, i) => {
          const sender = m.sender_id ?? m.senderId;
          const isMe = sender === user.id;

          return (
            <div
              key={i}
              style={{
                textAlign: isMe ? "right" : "left",
                margin: 5
              }}
            >
              <span
                style={{
                  background: isMe ? "#1877f2" : "#e4e6eb",
                  color: isMe ? "#fff" : "#000",
                  padding: 8,
                  borderRadius: 8,
                  display: "inline-block"
                }}
              >
                {m.body}
              </span>
            </div>
          );
        })}

        {/* ⌨️ Typing UI */}
        {typingUser && <p>{typingUser} is typing...</p>}
      </div>

      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          socket.emit("typing", { user: user.username });
        }}
        placeholder="Type message"
      />

      <button onClick={send}>Send</button>

      <Navbar />
    </div>
  );
}