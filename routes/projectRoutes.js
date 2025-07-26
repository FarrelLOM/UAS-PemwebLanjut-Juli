const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Ambil detail proyek by ID
router.get("/detail/:id", (req, res) => {
  const projectId = req.params.id;

  const sql = `
    SELECT 
      p.id, p.judul, p.deskripsi, p.kategori, p.deadline,
      p.gambar_url, p.lokasi, p.lat, p.lng, p.target_amount,
      IFNULL(SUM(d.amount), 0) AS total_donasi
    FROM projects p
    LEFT JOIN donations d ON d.project_id = p.id AND d.status = 'success'
    WHERE p.id = ?
    GROUP BY p.id
  `;

  db.query(sql, [projectId], (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ambil data proyek." });
    if (results.length === 0) return res.status(404).json({ error: "Proyek tidak ditemukan." });

    res.json(results[0]);
  });
});

module.exports = router;