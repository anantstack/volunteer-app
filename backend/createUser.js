import bcrypt from "bcrypt";
import db from "./config/db.js";

const password = "123456";

bcrypt.hash(password, 10).then(hash => {
  db.query(
    "INSERT INTO app_users (full_name, username, email, password_hash, city) VALUES (?, ?, ?, ?, ?)",
    ["Anant", "anant123", "anant@gmail.com", hash, "Delhi"],
    (err, result) => {
      if (err) console.log(err);
      else console.log("User created");
    }
  );
});