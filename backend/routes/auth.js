import express from "express";
import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🔐 LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM app_users WHERE username = ?",
    [username],
    async (err, results) => {
      if (err) return res.status(500).json(err);

      if (results.length === 0) {
        return res.status(400).json({ error: "User not found" });
      }

      const user = results[0];

      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(400).json({ error: "Wrong password" });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1d" }
      );

      const safeUser = {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        city: user.city
      };

      res.json({
        token,
        ...safeUser
      });
    }
  );
});

// 👥 USERS (🔥 OUTSIDE LOGIN)
router.get("/users", (req, res) => {
  db.query(
    "SELECT id, full_name, username FROM app_users",
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json(result);
    }
  );
});

router.post("/register", (req, res) => {
  const {
    full_name,
    username,
    password,
    email,
    phone,
    city,
    state,
    dob
  } = req.body;

  db.query(
    "INSERT INTO app_users (full_name, username, password, email, phone, city, state, dob) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [full_name, username, password, email, phone, city, state, dob],
    () => res.json({ message: "User created" })
  );
});

export default router;