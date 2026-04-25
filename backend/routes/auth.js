import express from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const router = express.Router();

const otpStore = {};

// 🔐 LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM app_users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(400).json({ message: "Wrong password" });
      }

      res.json({
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        city: user.city,
        state: user.state
      });
    }
  );
});


// 📩 SEND OTP
router.post("/send-otp", (req, res) => {
  const { email, username, phone } = req.body;

  db.query(
    "SELECT * FROM app_users WHERE email=? OR username=? OR phone=?",
    [email, username, phone],
    async (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res.status(400).json({
          message: "User already exists"
        });
      }

      const otp = Math.floor(100000 + Math.random() * 900000);
      otpStore[email] = otp;

      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
          }
        });

        await transporter.sendMail({
          from: process.env.EMAIL,
          to: email,
          subject: "OTP",
          text: `Your OTP is ${otp}`
        });

        res.json({ message: "OTP sent" });

      } catch (err) {
        res.status(500).json({ message: "Email failed" });
      }
    }
  );
});


// ✅ VERIFY + REGISTER
router.post("/verify-otp-register", async (req, res) => {
  const {
    full_name,
    username,
    email,
    password,
    phone,
    city,
    state,
    dob,
    otp
  } = req.body;

  if (otpStore[email] != otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const hash = await bcrypt.hash(password, 10);

  db.query(
    `INSERT INTO app_users 
    (full_name, username, email, password_hash, phone, city, state, dob)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, username, email, hash, phone, city, state, dob],
    (err) => {
      if (err) return res.status(500).json(err);

      delete otpStore[email];
      res.json({ message: "Registered" });
    }
  );
});


// 🔄 UPDATE PROFILE
router.post("/update", (req, res) => {
  const { id, phone, city, state } = req.body;

  db.query(
    "UPDATE app_users SET phone=?, city=?, state=? WHERE id=?",
    [phone, city, state, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated" });
    }
  );
});

export default router;