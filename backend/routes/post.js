import express from "express";
import db from "../config/db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const router = express.Router();


// 📁 MULTER CONFIG
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


// 📄 GET POSTS (UPDATED)
router.get("/", (req, res) => {
  db.query(
    `
    SELECT 
      p.id,
      p.title,
      p.description,
      p.image,
      p.date,
      p.venue,
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


// ➕ CREATE POST (FIXED WITH IMAGE UPLOAD)
router.post("/", upload.single("image"), (req, res) => {
  try {
    const { title, description, date, venue, userId } = req.body;

    const image = req.file ? req.file.filename : null;

    if (!title || !description || !userId) {
      return res.status(400).json({ error: "Missing fields" });
    }

    db.query(
      "INSERT INTO volunteer_posts (title, description, image, date, venue, author_id) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, image, date, venue, userId],
      (err) => {
        if (err) {
          console.log("POST ERROR:", err);
          return res.status(500).json(err);
        }

        res.json({ message: "Post created" });
      }
    );

  } catch (err) {
    console.log("POST ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ❤️ LIKE / UNLIKE TOGGLE (ALREADY GOOD)
router.post("/like", (req, res) => {
  const { postId, userId } = req.body;

  db.query(
    "SELECT * FROM likes WHERE post_id=? AND user_id=?",
    [postId, userId],
    (err, result) => {
      if (result.length > 0) {
        // UNLIKE
        db.query(
          "DELETE FROM likes WHERE post_id=? AND user_id=?",
          [postId, userId],
          () => res.json({ message: "Unliked" })
        );
      } else {
        // LIKE
        db.query(
          "INSERT INTO likes (post_id, user_id) VALUES (?, ?)",
          [postId, userId],
          () => res.json({ message: "Liked" })
        );
      }
    }
  );
});

export default router;