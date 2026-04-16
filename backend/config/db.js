import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

console.log("👉 DATABASE_URL:", process.env.DATABASE_URL);

const db = mysql.createConnection(process.env.DATABASE_URL);



db.connect((err) => {
  if (err) {
    console.log("❌ DB Error:", err);
  } else {
    console.log("✅ MySQL Connected (Railway)");
  }
});

export default db;