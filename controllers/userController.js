const db = require("../config/db");

exports.submitProject = (req, res) => {
  const { judul, deskripsi, kategori, lokasi, deadline, whatsapp, lat, lng, target_amount } = req.body;
  const userId = req.user.id;

  const gambar_url = req.file ? req.file.path : "-";

  const proyek = {
    user_id: userId,
    judul,
    deskripsi,
    kategori,
    lokasi,
    deadline,
    gambar_url,
    status: "pending",
    whatsapp,
    lat,
    lng,
    target_amount
  };

  db.query("INSERT INTO projects SET ?", proyek, (err) => {
    if (err) return res.status(500).send("Gagal menyimpan proyek");
    // Update whatsapp tanpa menutup koneksi
    db.query("UPDATE users SET whatsapp = ? WHERE id = ?", [whatsapp, userId], (err2) => {
      // Abaikan error update whatsapp, tetap redirect
      return res.redirect("/dashboard");
    });
  });
};

exports.getMapData = (req, res) => {
  db.query(
    "SELECT judul, kategori, lat, lng FROM projects WHERE status = 'approved'",
    (err, rows) => {
      if (err) return res.status(500).send("DB Error");
      res.json(rows);
    }
  );
};

exports.getExploreProjects = (req, res) => {
  const { search = "", sort = "" } = req.query;

  let sql = "SELECT * FROM projects WHERE status = 'approved' AND deadline >= CURDATE()";
  const params = [];

  if (search) {
    sql += " AND (judul LIKE ? OR kategori LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  if (sort === "deadline") {
    sql += " ORDER BY deadline ASC";
  } else if (sort === "terlama") {
    sql += " ORDER BY created_at ASC";
  } else {
    sql += " ORDER BY created_at DESC"; // default terbaru
  }

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).send("DB Error");
    res.json(rows);
  });
};
exports.getProjectDetail = (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM projects WHERE id = ?", [id], (err, rows) => {
    if (err) return res.status(500).send("DB Error");
    res.json(rows[0]);
  });
};

exports.getMyProjects = (req, res) => {
  const userId = req.user.id;
  db.query("SELECT * FROM projects WHERE user_id = ?", [userId], (err, rows) => {
    if (err) return res.status(500).send("DB Error");
    res.json(rows);
  });
};

exports.getLeaderboard = (req, res) => {
  const sql = `
    SELECT u.id, u.username AS name,
      COALESCE(SUM(d.amount), 0) AS total_donasi,
      (SELECT COUNT(*) FROM projects p WHERE p.user_id = u.id) AS jumlah_proyek
    FROM users u
    LEFT JOIN donations d ON d.user_id = u.id
    GROUP BY u.id
    ORDER BY total_donasi DESC
    LIMIT 10
  `;

  db.query(sql, (err, users) => {
    if (err) return res.status(500).json([]);

    // Ambil badge untuk setiap user
    const userIds = users.map(u => u.id);
    if (!userIds.length) return res.json([]);

    const badgeSql = `
      SELECT ub.user_id, b.name, b.icon_url
      FROM user_badges ub
      JOIN badges_leaderboard b ON ub.badge_id = b.id
      WHERE ub.user_id IN (?)
    `;

    db.query(badgeSql, [userIds], (err, badges) => {
      if (err) return res.json(users.map(u => ({ ...u, badges: [] })));

      const grouped = {};
      badges.forEach(b => {
        if (!grouped[b.user_id]) grouped[b.user_id] = [];
        grouped[b.user_id].push({ name: b.name, icon_url: b.icon_url });
      });

      const finalData = users.map(u => ({
        ...u,
        badges: grouped[u.id] || []
      }));

      res.json(finalData);
    });
  });
};

exports.getProfileData = (req, res) => {
  const userId = req.user.id;
  const sql = "SELECT name, no_wa FROM users WHERE id = ?";
  db.query(sql, [userId], (err, results) => {
    if (err || results.length === 0) return res.status(500).json({});
    res.json(results[0]);
  });
};

exports.updateProfile = (req, res) => {
  const userId = req.user.id;
  const { username, password, no_wa } = req.body;

  const values = [username, no_wa];
  let sql = "UPDATE users SET name = ?, no_wa = ?";

  if (password) {
    sql += ", password = ?";
    values.push(password);
  }

  sql += " WHERE id = ?";
  values.push(userId);

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Update profil error:", err);
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
};