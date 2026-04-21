import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 🔔 GET notifications
router.get("/:userId", (req, res) => {
  db.query(
    "SELECT * FROM notifications WHERE user_id=? ORDER BY id DESC",
    [req.params.userId],
    (err, result) => res.json(result)
  );
});

// unread count
router.get("/unread/:userId", (req, res) => {
  db.query(
    "SELECT COUNT(*) as count FROM notifications WHERE user_id=?",
    [req.params.userId],
    (err, result) => res.json(result[0])
  );
});

// ✅ mark as read
router.post("/read", (req, res) => {
  const { id } = req.body;

  db.query(
    "UPDATE notifications SET is_read=TRUE WHERE id=?",
    [id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Marked read" });
    }
  );
});

export default router;