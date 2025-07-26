const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureRole } = require("../middleware/authMiddleware");
const db = require("../config/db");

// ✅ Tampilkan semua withdraw
router.get("/", ensureAuthenticated, ensureRole, (req, res) => {
  const sql = `
    SELECT w.id, w.amount, w.status, w.created_at, u.name AS user_name, p.judul AS project_title
    FROM withdrawals w
    JOIN users u ON w.user_id = u.id
    JOIN projects p ON w.project_id = p.id
    ORDER BY w.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ambil data withdraw." });
    res.json(results);
  });
});

// ✅ Update status withdraw (approve / reject)
router.post("/update", ensureAuthenticated, ensureRole, (req, res) => {
  const { id, status } = req.body;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Status tidak valid." });
  }

  const sql = `UPDATE withdrawals SET status = ? WHERE id = ?`;
  db.query(sql, [status, id], (err) => {
    if (err) return res.status(500).json({ error: "Gagal update status withdraw." });
    res.json({ message: `Withdraw berhasil di-${status}.` });
  });
});

module.exports = router;