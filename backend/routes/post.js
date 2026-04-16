import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 📄 GET POSTS (with author + correct likes)
router.get("/", (req, res) => {
  db.query(
    `
    SELECT 
      p.*,
      u.full_name,
      u.username,
      (
        SELECT COUNT(DISTINCT l.user_id)
        FROM likes l
        WHERE l.post_id = p.id
      ) AS likes
    FROM volunteer_posts p
    LEFT JOIN app_users u ON p.author_id = u.id
    ORDER BY p.id DESC
    `,
    (err, result) => {
      if (err) {
        console.log("GET POSTS ERROR:", err);
        return res.status(500).json(err);
      }
      res.json(result);
    }
  );
});

// ➕ CREATE POST (with author_id)
router.post("/", (req, res) => {
  const { title, description, userId } = req.body;

  db.query(
    "INSERT INTO volunteer_posts (title, description, author_id) VALUES (?, ?, ?)",
    [title, description, userId],
    (err) => {
      if (err) {
        console.log("POST ERROR:", err);
        return res.status(500).json(err);
      }
      res.json({ message: "Post created" });
    }
  );
});

// ❤️ LIKE / UNLIKE TOGGLE (🔥 FINAL FIX)
router.post("/like", (req, res) => {
  const { postId, userId } = req.body;

  // check already liked
  db.query(
    "SELECT * FROM likes WHERE post_id=? AND user_id=?",
    [postId, userId],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        // ❌ already liked → UNLIKE
        db.query(
          "DELETE FROM likes WHERE post_id=? AND user_id=?",
          [postId, userId],
          (err) => {
            if (err) return res.status(500).json(err);
            return res.json({ message: "Unliked" });
          }
        );
      } else {
        // ✅ LIKE
        db.query(
          "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
          [postId, userId],
          (err) => {
            if (err) return res.status(500).json(err);
            return res.json({ message: "Liked" });
          }
        );
      }
    }
  );
});

export default router;