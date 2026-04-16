import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 📄 GET POSTS (WITH USER)
router.get("/", (req, res) => {
  db.query(
    `
    SELECT 
      p.id,
      p.title,
      p.description,
      p.author_id,
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

// ➕ CREATE POST (WITH USER)
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

// ❤️ LIKE POST (SAFE)
router.post("/like", (req, res) => {
  const { postId, userId } = req.body;

  db.query(
    "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
    [postId, userId],
    (err) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.json({ message: "Already liked" });
        }

        console.log("LIKE ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({ message: "Liked" });
    }
  );
});

export default router;