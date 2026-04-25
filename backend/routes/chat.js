import express from "express";
import db from "../config/db.js";

const router = express.Router();


// 🔥 CREATE OR GET CONVERSATION
router.post("/conversation", (req, res) => {
  const { user1, user2 } = req.body;

  db.query(
    `
    SELECT c.id FROM conversations c
    JOIN conversation_members m1 ON c.id = m1.conversation_id
    JOIN conversation_members m2 ON c.id = m2.conversation_id
    WHERE m1.user_id=? AND m2.user_id=?
    `,
    [user1, user2],
    (err, result) => {
      if (err) return res.status(500).json(err);

      // ✅ already exists
      if (result.length > 0) {
        return res.json({ conversationId: result[0].id });
      }

      // 🔥 create new conversation
      db.query("INSERT INTO conversations () VALUES ()", (err, conv) => {
        if (err) return res.status(500).json(err);

        const convId = conv.insertId;

        db.query(
          "INSERT INTO conversation_members (conversation_id, user_id) VALUES (?, ?), (?, ?)",
          [convId, user1, convId, user2],
          (err) => {
            if (err) return res.status(500).json(err);

            res.json({ conversationId: convId });
          }
        );
      });
    }
  );
});


// 📄 GET MESSAGES (WITH CLEAN ORDER + SAFE)
router.get("/:conversationId", (req, res) => {
  const { conversationId } = req.params;

  db.query(
    `
    SELECT 
      m.id,
      m.conversation_id,
      m.sender_id,
      m.body,
      m.sent_at
    FROM messages m
    WHERE m.conversation_id=?
    ORDER BY m.sent_at ASC
    `,
    [conversationId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});


// ➕ SEND MESSAGE
router.post("/", (req, res) => {
  const { conversationId, senderId, body } = req.body;

  if (!body) {
    return res.status(400).json({ message: "Empty message" });
  }

  db.query(
    `
    INSERT INTO messages (conversation_id, sender_id, body, sent_at) 
    VALUES (?, ?, ?, NOW())
    `,
    [conversationId, senderId, body],
    (err, result) => {
      if (err) return res.status(500).json(err);

      res.json({
        id: result.insertId,
        conversation_id: conversationId,
        sender_id: senderId,
        body,
        sent_at: new Date()
      });
    }
  );
});


// 🔥 CHAT LIST (VERY IMPORTANT FOR CHAT PAGE)
router.get("/list/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    `
    SELECT 
      u.id AS user_id,
      u.full_name,
      u.username,
      m.body AS last_message,
      m.sent_at AS last_time
    FROM conversations c

    JOIN conversation_members cm1 
      ON c.id = cm1.conversation_id

    JOIN conversation_members cm2 
      ON c.id = cm2.conversation_id AND cm2.user_id != cm1.user_id

    JOIN app_users u 
      ON u.id = cm2.user_id

    LEFT JOIN messages m 
      ON m.conversation_id = c.id

    WHERE cm1.user_id = ?

    ORDER BY m.sent_at DESC
    `,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      // 🔥 remove duplicate chats (same user multiple messages)
      const unique = [];
      const map = new Set();

      for (let r of result) {
        if (!map.has(r.user_id)) {
          unique.push(r);
          map.add(r.user_id);
        }
      }

      res.json(unique);
    }
  );
});

export default router;