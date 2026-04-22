import bcrypt from "bcrypt";

router.post("/register", async (req, res) => {
  const { full_name, username, password, email, phone, city, state, dob } = req.body;

  if (!email || !password || !username) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO app_users (full_name, username, password_hash, email, phone, city, state, dob) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [full_name, username, hashedPassword, email, phone, city, state, dob],
      (err) => {
        if (err) {
          console.log("REGISTER ERROR:", err);
          return res.status(500).json(err);
        }

        res.json({ message: "Account created" });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});