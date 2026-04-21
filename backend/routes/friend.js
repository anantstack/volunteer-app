import express from "express";
import db from "../config/db.js";
import { io } from "../server.js";

const router = express.Router();

// ➕ SEND REQUEST
router.post("/send", (req, res) => {
  const { fromUser, toUser } = req.body;

  db.query(
    "SELECT * FROM friends WHERE from_user=? AND to_user=?",
    [fromUser, toUser],
    (err, result) => {
      if (result && result.length > 0) {
        return res.json({ message: "Already sent" });
      }

      db.query(
        "INSERT INTO friends (from_user, to_user, status) VALUES (?, ?, 'pending')",
        [fromUser, toUser],
        (err) => {
          if (err) return res.status(500).json(err);

          db.query(
            "INSERT INTO notifications (user_id, text) VALUES (?, ?)",
            [toUser, "New friend request"]
          );

          // 🔥 REALTIME
          io.to(toUser).emit("new_friend_request");

          res.json({ message: "Request sent" });
        }
      );
    }
  );
});

// ✅ ACCEPT
router.post("/accept", (req, res) => {
  const { id } = req.body;

  db.query(
    "UPDATE friends SET status='accepted' WHERE id=?",
    [id],
    () => {
      io.emit("friend_request_accepted");
      res.json({ message: "Accepted" });
    }
  );
});

// ❌ REJECT
router.post("/reject", (req, res) => {
  const { id } = req.body;

  db.query(
    "DELETE FROM friends WHERE id=?",
    [id],
    () => res.json({ message: "Rejected" })
  );
});

// 📄 GET
router.get("/requests/:userId", (req, res) => {
  db.query(
    `
    SELECT f.id, u.full_name, u.username
    FROM friends f
    JOIN app_users u ON f.from_user = u.id
    WHERE f.to_user=? AND f.status='pending'
    `,
    [req.params.userId],
    (err, result) => {
      if (err) return res.status(500).json([]);
      res.json(Array.isArray(result) ? result : []);
    }
  );
});

export default router;