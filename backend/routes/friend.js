import express from "express";
import db from "../config/db.js";

const router = express.Router();

// ➕ SEND REQUEST
router.post("/send", (req, res) => {
  const { fromUser, toUser } = req.body;

  const io = req.app.get("io");

  // 🔒 prevent duplicate
  db.query(
    "SELECT * FROM friends WHERE from_user=? AND to_user=?",
    [fromUser, toUser],
    (err, exist) => {
      if (exist.length > 0) {
        return res.json({ message: "Already requested" });
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

          if (io) {
            io.to(String(toUser)).emit("new_friend_request");
          }

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
    (err) => {
      if (err) return res.status(500).json(err);
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
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Rejected" });
    }
  );
});

// 📄 GET REQUESTS
router.get("/requests/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    `
    SELECT f.id, u.full_name, u.username
    FROM friends f
    JOIN app_users u ON f.from_user = u.id
    WHERE f.to_user=? AND f.status='pending'
    ORDER BY f.id DESC
    `,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json([]);
      res.json(result);
    }
  );
});

// 📄 FRIEND LIST
router.get("/:userId", (req, res) => {
  const userId = req.params.userId;

  db.query(
    `
    SELECT 
      CASE 
        WHEN f.from_user = ? THEN u2.id
        ELSE u1.id
      END AS id,
      CASE 
        WHEN f.from_user = ? THEN u2.full_name
        ELSE u1.full_name
      END AS full_name,
      CASE 
        WHEN f.from_user = ? THEN u2.username
        ELSE u1.username
      END AS username
    FROM friends f
    JOIN app_users u1 ON u1.id = f.from_user
    JOIN app_users u2 ON u2.id = f.to_user
    WHERE (f.from_user=? OR f.to_user=?)
    AND f.status='accepted'
    `,
    [userId, userId, userId, userId, userId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

export default router;