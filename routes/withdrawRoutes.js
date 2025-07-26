const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/authMiddleware");
const db = require("../config/db");

// ✅ Ajukan withdraw
router.post("/ajukan", ensureAuthenticated, (req, res) => {
  const { project_id } = req.body;
  const user_id = req.user.id;

  // Cek apakah user pemilik proyek
  const checkSql = `
    SELECT p.id, p.user_id, p.target_amount,
      IFNULL(SUM(d.amount), 0) AS total_donasi,
      (SELECT COUNT(*) FROM withdrawals w WHERE w.project_id = p.id) AS sudah_withdraw
    FROM projects p
    LEFT JOIN donations d ON d.project_id = p.id AND d.status = 'success'
    WHERE p.id = ? GROUP BY p.id
  `;

  db.query(checkSql, [project_id], (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal memeriksa proyek." });

    if (!results.length) return res.status(404).json({ error: "Proyek tidak ditemukan." });

    const p = results[0];
    if (p.user_id !== user_id) return res.status(403).json({ error: "Bukan pemilik proyek." });
    if (p.total_donasi < p.target_amount)
      return res.status(400).json({ error: "Target belum tercapai." });
    if (p.sudah_withdraw > 0)
      return res.status(400).json({ error: "Dana sudah pernah ditarik." });

    // Simpan data withdraw
    const amount = p.total_donasi;
    const insertSql = "INSERT INTO withdrawals SET ?";
    db.query(insertSql, { user_id, project_id, amount, status: "pending" }, (err2) => {
      if (err2) return res.status(500).json({ error: "Gagal menyimpan pengajuan." });
      res.json({ message: "Pengajuan withdraw berhasil dikirim." });
    });
  });
});

module.exports = router;