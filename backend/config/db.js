import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

let db;

if (process.env.DATABASE_URL) {
  // 🔥 Production (Railway via Render)
  db = mysql.createConnection(process.env.DATABASE_URL);
} else {
  // 🧑‍💻 Local fallback (optional)
  db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Baba1212@", // apna local password
    database: "volunteer",
    port: 3306
  });
}

db.connect((err) => {
  if (err) {
    console.log("❌ DB Error FULL:", err); // 🔥 full error print
  } else {
    console.log("✅ MySQL Connected");
  }
});

export default db;