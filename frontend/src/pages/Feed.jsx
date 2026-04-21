<div style={{ paddingBottom: 60 }}>
  <Topbar title="Feed" />

  <div style={{ padding: 12 }}>
    {posts.map(p => (
      <div
        key={p.id}
        style={{
          background: "#fff",
          padding: 14,
          marginBottom: 12,
          borderRadius: 16,
          border: "1px solid #eee"
        }}
      >
        <div style={{ fontWeight: 600 }}>
          {p.full_name} (@{p.username})
        </div>

        <h4>{p.title}</h4>
        <p style={{ color: "#555" }}>{p.description}</p>

        {p.image && (
          <img
            src={`https://volunteer-backend-yu6v.onrender.com/uploads/${p.image}`}
            style={{
              width: "100%",
              borderRadius: 12,
              marginTop: 8
            }}
          />
        )}

        <div style={{ color: "#888", fontSize: 12 }}>
          {p.date && `📅 ${new Date(p.date).toLocaleDateString()} `}
          {p.venue && `• 📍 ${p.venue}`}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button onClick={() => likePost(p.id)} style={{ cursor: "pointer" }}>
            ❤️ {p.likes || 0}
          </button>
          <button>💬</button>
          <button>🔗</button>
        </div>
      </div>
    ))}
  </div>

  <Navbar />
</div>