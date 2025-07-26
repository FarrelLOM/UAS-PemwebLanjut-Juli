const express = require("express");
const router = express.Router();
const db = require("../config/db");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

router.get("/data", ensureAuthenticated, (req, res) => {
  const sql = `
    SELECT id, judul, lat, lng
    FROM projects
    WHERE status = 'approved'
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Gagal ambil data proyek" });
    res.json(results);
  });
});

module.exports = router;