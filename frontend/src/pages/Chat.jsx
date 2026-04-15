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

  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const otherUserId = parseInt(id);

  useEffect(() => {
    if (user) socket.emit("join", user.id);
  }, []);

  useEffect(() => {
    if (!user || !otherUserId) return;

    API.post("/chat/conversation", {
      user1: user.id,
      user2: otherUserId
    }).then(res => {
      setConversationId(res.data.conversationId);
    });
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
      }
    });

    return () => socket.off("receive_message");
  }, [conversationId]);

  const send = async () => {
    if (!text || !conversationId) return;

    const msg = {
      conversationId,
      senderId: user.id,
      body: text
    };

    await API.post("/chat", msg);
    socket.emit("send_message", msg);

    setText("");
  };

  return (
    <div style={{ padding: 10, paddingBottom: 60 }}>
      <h3>Chat</h3>

      {messages.map((m, i) => {
        const isMe =
          m.sender_id === user.id || m.senderId === user.id;

        return (
          <div key={i} style={{ textAlign: isMe ? "right" : "left" }}>
            <span>{m.body}</span>
          </div>
        );
      })}

      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={send}>Send</button>

      <Navbar />
    </div>
  );
}