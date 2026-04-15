import express from "express";
import db from "../config/db.js";

const router = express.Router();

// 📄 GET POSTS
router.get("/", (req, res) => {
  db.query(
    `
    SELECT p.*, COUNT(l.id) AS likes
    FROM volunteer_posts p
    LEFT JOIN likes l ON p.id = l.post_id
    GROUP BY p.id
    `,
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

// ➕ CREATE POST (FIXED)
router.post("/", (req, res) => {
  const { title, description } = req.body;

  db.query(
    "INSERT INTO volunteer_posts (title, description) VALUES (?, ?)",
    [title, description],
    (err) => {
      if (err) {
        console.log("🔥 POST ERROR FULL:", err);
        return res.status(500).json(err);
      }

      // ✅ RESPONSE ADD (tumhare code me missing tha)
      res.json({ message: "Post created" });
    }
  );
});

// ❤️ LIKE POST
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
        return res.status(500).json(err);
      }

      res.json({ message: "Liked" });
    }
  );
});

export default router;