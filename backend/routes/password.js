import express from "express";
import db from "../config/db.js";
import nodemailer from "nodemailer";

const router = express.Router();

// 🔥 MAIL CONFIG
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_EMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD"
  }
});

// 🔥 SEND OTP
router.post("/send-otp", (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000);

  db.query(
    "UPDATE app_users SET otp=? WHERE email=?",
    [otp, email],
    (err) => {
      if (err) return res.status(500).json(err);

      transporter.sendMail({
        from: "YOUR_EMAIL@gmail.com",
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is ${otp}`
      });

      res.json({ message: "OTP sent" });
    }
  );
});

// 🔥 VERIFY OTP + RESET
router.post("/reset", (req, res) => {
  const { email, otp, newPassword } = req.body;

  db.query(
    "SELECT * FROM app_users WHERE email=? AND otp=?",
    [email, otp],
    (err, result) => {
      if (result.length === 0) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      db.query(
        "UPDATE app_users SET password=?, otp=NULL WHERE email=?",
        [newPassword, email],
        () => res.json({ message: "Password updated" })
      );
    }
  );
});

export default router;