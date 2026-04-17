import express from "express";
import db from "../config/db.js";

const router = express.Router();

// send request
router.post("/send", (req, res) => {
  const { senderId, receiverId } = req.body;

  db.query(
    "INSERT INTO friends (sender_id, receiver_id) VALUES (?, ?)",
    [senderId, receiverId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Request sent" });
    }
  );
});

// accept
router.post("/accept", (req, res) => {
  const { id } = req.body;

  db.query(
    "UPDATE friends SET status='accepted' WHERE id=?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Accepted" });
    }
  );
});

// get friends
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    `
    SELECT u.* FROM friends f
    JOIN app_users u 
    ON (u.id = f.sender_id OR u.id = f.receiver_id)
    WHERE (f.sender_id = ? OR f.receiver_id = ?)
    AND f.status = 'accepted'
    AND u.id != ?
    `,
    [userId, userId, userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

export default router;