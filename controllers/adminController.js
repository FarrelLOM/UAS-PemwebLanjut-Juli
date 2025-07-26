const db = require("../config/db");

exports.listProjects = (req, res) => {
  db.query("SELECT * FROM projects ORDER BY created_at DESC", (err, rows) => {
    if (err) return res.status(500).send("DB Error");
    res.json(rows);
  });
};

exports.approveProject = (req, res) => {
  const id = req.params.id;
  db.query("UPDATE projects SET status = 'approved' WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("Gagal menyetujui proyek");
    res.redirect("/admin");
  });
};

exports.rejectProject = (req, res) => {
  const id = req.params.id;
  db.query("UPDATE projects SET status = 'rejected' WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send("Gagal menolak proyek");
    res.redirect("/admin");
  });
};
exports.getAllReports = (req, res) => {
  const sql = `
    SELECT * FROM project_reports ORDER BY created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json([]);
    res.json(results);
  });
};

exports.verifyReport = (req, res) => {
  const reportId = req.params.id;
  const { status } = req.body;
  const sql = `UPDATE project_reports SET status = ? WHERE id = ?`;
  db.query(sql, [status, reportId], (err) => {
    if (err) return res.status(500).json({ message: "Gagal update status" });
    res.json({ message: `Laporan ${status === 'approved' ? 'disetujui' : 'ditolak'}.` });
  });
};
