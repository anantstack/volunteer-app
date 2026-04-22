import bcrypt from "bcrypt";

router.post("/register", async (req, res) => {
  console.log("BODY:", req.body);

  const { full_name, username, password, email, phone, city, state, dob } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    // 🔥 DUPLICATE CHECK
    db.query(
      "SELECT * FROM app_users WHERE username=? OR email=?",
      [username, email],
      async (err, result) => {
        if (result.length > 0) {
          return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO app_users 
          (full_name, username, email, password_hash, phone, city, state, dob) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [full_name, username, email, hashedPassword, phone, city, state, dob],
          (err) => {
            if (err) {
              console.log("SQL ERROR:", err);
              return res.status(500).json(err);
            }

            res.json({ message: "Account created successfully" });
          }
        );
      }
    );

  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});