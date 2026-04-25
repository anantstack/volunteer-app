import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

const router = express.Router();

const otpStore = {}; // temp store

// 📩 SEND OTP
router.post("/send-otp", async (req, res) => {
  const { email, username, phone } = req.body;

  try {
    // 🔒 UNIQUE CHECK
    const [exists] = await db.query(
      "SELECT * FROM app_users WHERE email=? OR username=? OR phone=?",
      [email, username, phone]
    );

    if (exists.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = otp;

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
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`
    });

    res.json({ message: "OTP sent" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "OTP failed" });
  }
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

  try {
    if (otpStore[email] != otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hash = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO app_users 
      (full_name, username, email, password_hash, phone, city, state, dob)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        username,
        email,
        hash,
        phone,
        city,
        state,
        dob // ⚠️ must be YYYY-MM-DD
      ]
    );

    delete otpStore[email];

    res.json({ message: "Registered successfully" });
    
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
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Register failed" });
  }
});

export default router;