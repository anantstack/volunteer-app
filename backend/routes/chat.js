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

      // already exists
      if (result.length > 0) {
        return res.json({ conversationId: result[0].id });
      }

      // create new
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


// 📄 GET MESSAGES
router.get("/:conversationId", (req, res) => {
  const { conversationId } = req.params;

  db.query(
    "SELECT * FROM messages WHERE conversation_id=? ORDER BY sent_at",
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

  db.query(
    "INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)",
    [conversationId, senderId, body],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Message sent" });
    }
  );
});


export default router;