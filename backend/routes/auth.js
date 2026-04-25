import express from "express";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { full_name, username, password, email, phone, city, state, dob } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    db.query(
      "SELECT * FROM app_users WHERE username=? OR email=?",
      [username, email],
      async (err, result) => {
        if (result.length > 0) {
          return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO app_users 
          (full_name, username, email, password_hash, phone, city, state, dob) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [full_name, username, email, hashedPassword, phone, city, state, dob],
          (err) => {
            if (err) {
              console.log(err);
              return res.status(500).json(err);
            }

            res.json({ message: "Account created" });
          }
        );
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;