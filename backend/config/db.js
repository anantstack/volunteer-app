import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// 🔥 parse DATABASE_URL
const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((err) => {
  if (err) {
    console.log("❌ DB Error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

export default db;