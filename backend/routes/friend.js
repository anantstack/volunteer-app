router.get("/requests/:userId", (req, res) => {
  db.query(
    `
    SELECT f.id, u.full_name, u.username
    FROM friends f
    JOIN app_users u ON f.from_user = u.id
    WHERE f.to_user=? AND f.status='pending'
    `,
    [req.params.userId],
    (err, result) => {
      if (err) {
        console.log("REQUEST ERROR:", err);
        return res.status(500).json([]);
      }

      // 🔥 CRITICAL FIX
      if (!result || !Array.isArray(result)) {
        return res.json([]);
      }

      res.json(result);
    }
  );
});