import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

let db;

if (process.env.DATABASE_URL) {
  db = mysql.createConnection({
    uri: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
} else {
  db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Baba1212@",
    database: "volunteer",
    port: 3306
  });
}

db.connect((err) => {
  if (err) {
    console.log("❌ DB Error:", err);
  } else {
    console.log("✅ MySQL Connected");
  }
});

export default db;