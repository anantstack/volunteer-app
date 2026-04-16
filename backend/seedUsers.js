import bcrypt from "bcrypt";
import db from "./config/db.js";

const users = [
  { name: "Rahul Sharma", username: "rahul", email: "rahul@gmail.com", city: "Delhi" },
  { name: "Priya Verma", username: "priya", email: "priya@gmail.com", city: "Mumbai" },
  { name: "Amit Kumar", username: "amit", email: "amit@gmail.com", city: "Noida" }
];

const run = async () => {
  for (let u of users) {
    const hash = await bcrypt.hash("123456", 10);

    db.query(
      "INSERT INTO app_users (full_name, username, email, password_hash, city) VALUES (?, ?, ?, ?, ?)",
      [u.name, u.username, u.email, hash, u.city],
      (err) => {
        if (err) console.log("Error:", err);
        else console.log("Inserted:", u.username);
      }
    );
  }
};

run();