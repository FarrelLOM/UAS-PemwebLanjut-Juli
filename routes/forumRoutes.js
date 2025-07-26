// routes/forumRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const forumController = require("../controllers/forumController");
const { ensureAuthenticated } = require("../middleware/authMiddleware");

// Gunakan memoryStorage untuk upload ke Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// Tambahkan di routes/forumRoutes.js
router.get("/posts", ensureAuthenticated, forumController.getPosts);
router.post("/create", ensureAuthenticated, upload.single("image"), forumController.createPost);
router.post("/delete", ensureAuthenticated, forumController.deletePost);
router.post("/update", ensureAuthenticated, forumController.updatePost);

module.exports = router;