import db from "./config/db.js";

const queries = [

  `CREATE TABLE IF NOT EXISTS volunteer_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    author_id INT
  )`,

  `CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT,
    UNIQUE(post_id, user_id)
  )`,

  `CREATE TABLE IF NOT EXISTS app_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100),
    username VARCHAR(100),
    email VARCHAR(100),
    password_hash VARCHAR(255),
    city VARCHAR(100)
  )`,

  `CREATE TABLE IF NOT EXISTS conversations (
    id INT AUTO_INCREMENT PRIMARY KEY
  )`,

  // 🔥 FIX (missing table)
  `CREATE TABLE IF NOT EXISTS conversation_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT,
    user_id INT
  )`,

  `CREATE TABLE IF NOT EXISTS volunteer_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  author_id INT
  )`,

  `CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT,
    sender_id INT,
    body TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`
];

queries.forEach((q) => {
  db.query(q, (err) => {
    if (err) console.log("❌ Error:", err);
    else console.log("✅ Table ready");
  });
});