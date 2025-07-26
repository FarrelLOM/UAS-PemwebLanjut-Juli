const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { ensureAuthenticated, ensureRole } = require('../middleware/authMiddleware');
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });
const db = require('../config/db');

// USER ROUTES
router.get('/my', ensureAuthenticated, chatController.getUserChats);
router.post('/send', ensureAuthenticated, upload.single('image'), chatController.sendMessage);

// ADMIN ROUTES
router.get('/admin/users', ensureAuthenticated, chatController.getChatUsers); // Get list of users who have chatted
router.get('/admin/:userId', ensureAuthenticated, ensureRole('admin'), chatController.getChatWithUser);
router.post('/admin/:userId/send', ensureAuthenticated, ensureRole('admin'), upload.single('image'), chatController.sendReply); // Reply to user

// routes/chatRoutes.js (POST /chat/admin/:userId/read)
router.post('/admin/:userId/read', ensureAuthenticated, ensureRole('admin'), (req, res) => {
  const userId = req.params.userId;
  const adminId = req.user.id; // atau hardcoded jika admin ID-nya tetap
  db.query(
    'UPDATE chats SET is_read = 1 WHERE sender_id = ? AND receiver_id = ?',
    [userId, adminId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to mark as read' });
      res.json({ success: true });
    }
  );
});


module.exports = router;