const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureRole } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

router.get("/", ensureAuthenticated, ensureRole("admin"), (req, res) => {
  res.sendFile("adminDashboard.html", { root: "./views" });
});

router.get("/api/projects", ensureAuthenticated, ensureRole("admin"), adminController.listProjects);
router.post("/projects/approve/:id", ensureAuthenticated, ensureRole("admin"), adminController.approveProject);
router.post("/projects/reject/:id", ensureAuthenticated, ensureRole("admin"), adminController.rejectProject);

module.exports = router;
