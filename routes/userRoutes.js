const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureRole } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const db = require("../config/db");
const multer = require("multer");
const { storage } = require("../config/cloudinary");
const upload = multer({ storage });
const path = require("path");

// Profile routes
router.get("/profile", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../views/profile.html"));
});
router.get("/profile-data", ensureAuthenticated, userController.getProfileData);
router.post("/update-profile", ensureAuthenticated, userController.updateProfile);

// Form pengajuan proyek
router.get("/form-pengajuan", ensureAuthenticated, (req, res) => {
  res.sendFile("formPengajuanProyek.html", { root: "./views" });
});
router.post("/submit-project", ensureAuthenticated, upload.single("gambar"), userController.submitProject);

// Explore proyek
router.get("/explore", ensureAuthenticated, (req, res) => {
  res.sendFile("exploreProyek.html", { root: "./views" });
});
router.get("/api/explore", ensureAuthenticated, userController.getExploreProjects);

// Map routes
router.get("/map", ensureAuthenticated, (req, res) => {
  res.sendFile("map.html", { root: "./views" });
});
router.get("/api/mapdata", ensureAuthenticated, userController.getMapData);

// Leaderboard
router.get("/leaderboard", ensureAuthenticated, userController.getLeaderboard);

// Detail proyek
router.get("/proyek/:id", ensureAuthenticated, (req, res) => {
  res.sendFile("detailProyek.html", { root: "./views" });
});
router.get("/api/proyek/:id", ensureAuthenticated, userController.getProjectDetail);

// Donasi user
router.get("/donasi", ensureAuthenticated, (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT 
      d.id AS donation_id,
      d.amount,
      d.status,
      d.created_at,
      p.judul AS project_title
    FROM donations d
    JOIN projects p ON d.project_id = p.id
    WHERE d.user_id = ?
    ORDER BY d.created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Gagal ambil riwayat donasi:", err);
      return res.status(500).json({ error: "Gagal mengambil data donasi." });
    }
    res.json(results);
  });
});

// Proyek user + total donasi success
router.get("/proyekku", ensureAuthenticated, (req, res) => {
  const userId = req.user.id;
  const sql = `
    SELECT 
      p.id AS project_id,
      p.judul AS title,
      p.target_amount,
      IFNULL(SUM(d.amount), 0) AS total_donasi
    FROM projects p
    LEFT JOIN donations d ON d.project_id = p.id AND d.status = 'success'
    WHERE p.user_id = ?
    GROUP BY p.id, p.judul, p.target_amount
    ORDER BY p.created_at DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Gagal ambil proyek:", err);
      return res.status(500).json({ error: "Gagal mengambil data proyek." });
    }
    res.json(results);
  });
});

// Admin badge
router.post("/admin/badge", ensureRole("admin"), (req, res) => {
  const { user_id, badge_id } = req.body;
  const sql = `INSERT INTO user_badges (user_id, badge_id) VALUES (?, ?)`;
  db.query(sql, [user_id, badge_id], err => {
    if (err) return res.status(500).json({ error: "Gagal beri badge." });
    res.json({ success: true });
  });
});

module.exports = router;