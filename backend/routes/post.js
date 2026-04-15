router.post("/", (req, res) => {
  const { title, description, userId } = req.body;

  if (!title || !description || !userId) {
    return res.status(400).json({ error: "Missing fields" });
  }

  db.query(
    "INSERT INTO volunteer_posts (title, description, author_id) VALUES (?, ?, ?)",
    [title, description, userId],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "Post created" });
    }
  );
});