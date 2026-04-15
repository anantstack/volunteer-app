import bcrypt from "bcrypt";
import db from "./config/db.js";

const password = "123456";

bcrypt.hash(password, 10).then(hash => {

  // 🔥 STEP 1: delete old users
  db.query("DELETE FROM app_users", (err) => {
    if (err) {
      console.log("Delete error:", err);
      return;
    }

    console.log("Old users deleted");

    // 🔥 STEP 2: insert new user with hashed password
    db.query(
      "INSERT INTO app_users (full_name, username, email, password_hash, city) VALUES (?, ?, ?, ?, ?)",
      ["Anant", "anant123", "anant@gmail.com", hash, "Delhi"],
      (err, result) => {
        if (err) {
          console.log("Insert error:", err);
        } else {
          console.log("✅ User created successfully");
        }
      }
    );

  });

});