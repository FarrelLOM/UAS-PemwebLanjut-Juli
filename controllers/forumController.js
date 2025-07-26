// controllers/forumController.js
const db = require("../config/db");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getPosts = (req, res) => {
  const sql = `
    SELECT f.id, f.user_id, u.name, f.content, f.image, f.created_at
    FROM forum_posts f
    JOIN users u ON f.user_id = u.id
    ORDER BY f.created_at ASC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Forum DB error:", err);
      return res.status(500).json({ error: "Gagal memuat forum." });
    }
    // Kirim posts + role user
    res.json({
      posts: results,
      role: req.user.role
    });
  });
};

exports.createPost = async (req, res) => {
  const userId = req.user.id;
  const content = req.body.content;
  let imageUrl = null;

  try {
    if (req.file) {
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "uploads" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(req.file.buffer);
        });
      };
      const result = await streamUpload(req);
      imageUrl = result.secure_url;
    }

    const sql = `INSERT INTO forum_posts (user_id, content, image) VALUES (?, ?, ?)`;
    db.query(sql, [userId, content, imageUrl], (err) => {
      if (err) {
        console.error("Insert error:", err);
        return res.status(500).json({ error: "Gagal menyimpan postingan." });
      }
      res.json({ success: true });
    });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    res.status(500).json({ error: "Gagal upload gambar." });
  }
};

exports.deletePost = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });
  const postId = req.body.id;

  db.query("DELETE FROM forum_posts WHERE id = ?", [postId], (err) => {
    if (err) return res.status(500).json({ error: "Gagal menghapus postingan." });
    res.json({ success: true });
  });
};

exports.updatePost = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Unauthorized" });
  const { id, content } = req.body;

  db.query("UPDATE forum_posts SET content = ? WHERE id = ?", [content, id], (err) => {
    if (err) return res.status(500).json({ error: "Gagal update postingan." });
    res.json({ success: true });
  });
};