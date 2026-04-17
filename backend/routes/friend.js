import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 👉 SEND REQUEST
router.post("/request", (req, res) => {
  const { fromUser, toUser } = req.body;

  db.query(
    "INSERT INTO friends (from_user, to_user, status) VALUES (?, ?, 'pending')",
    [fromUser, toUser],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Request sent" });
    }
  );
});

// 👉 ACCEPT REQUEST
router.post("/accept", (req, res) => {
  const { requestId } = req.body;

  db.query(
    "UPDATE friends SET status='accepted' WHERE id=?",
    [requestId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Accepted" });
    }
  );
});

// 👉 GET FRIENDS
router.get("/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    `
    SELECT u.id, u.full_name, u.username
    FROM friends f
    JOIN app_users u 
      ON (u.id = f.from_user OR u.id = f.to_user)
    WHERE (f.from_user = ? OR f.to_user = ?) 
      AND f.status='accepted'
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