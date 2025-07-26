const db = require('../config/db');
const { cloudinary } = require('../config/cloudinary');

exports.getUserChats = (req, res) => {
  const userId = req.user.id;
  db.query(
    'SELECT * FROM chats WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at',
    [userId, userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json(results);
    }
  );
};

exports.sendMessage = async (req, res) => {
    const getAdminId = () => {
    return new Promise((resolve, reject) => {
      db.query("SELECT id FROM users WHERE role = 'admin' LIMIT 1", (err, rows) => {
        if (err || rows.length === 0) return reject("No admin found");
        resolve(rows[0].id);
      });
    });
  };
  const senderId = req.user.id;
  const receiverId = await getAdminId();
  const content = req.body.content || '';
  const imageUrl = req.file ? req.file.path : null;

  console.log("Send message debug:", { senderId, receiverId, content, imageUrl });

  db.query(
    'INSERT INTO chats (sender_id, receiver_id, content, image_url) VALUES (?, ?, ?, ?)',
    [senderId, receiverId, content, imageUrl],
    (err) => {
      if (err) {
        console.error("DB insert error:", err);
        return res.status(500).json({ error: 'Send failed' });
      }
      res.json({ success: true });
    }
  );
};


// controllers/chatController.js
exports.getChatUsers = (req, res) => {
  const adminId = req.user.id; // asumsikan admin login
  db.query(`
    SELECT u.id, u.name, u.no_wa,
      EXISTS (
        SELECT 1 FROM chats 
        WHERE sender_id = u.id AND receiver_id = ? AND is_read = 0
      ) AS has_unread
    FROM users u
    WHERE u.role = 'user'
  `, [adminId], (err, users) => {
    if (err) return res.status(500).json({ error: 'Error loading users' });
    res.json(users.map(u => ({
      ...u,
      has_unread: !!u.has_unread
    })));
  });
};

exports.getChatWithUser = (req, res) => {
const adminId = req.user.id;
const userId = parseInt(req.params.userId);

db.query(
  `SELECT * FROM chats WHERE 
    (sender_id = ? AND receiver_id = ?) OR 
    (sender_id = ? AND receiver_id = ?) 
    ORDER BY created_at`,
  [adminId, userId, userId, adminId],
  (err, results) => {
    if (err) return res.status(500).json({ error: 'Load chat failed' });
    res.json(results);
  }
);
};


exports.sendReply = (req, res) => {
const senderId = req.user.id; // ✅
const receiverId = req.params.userId;
  const content = req.body.content || '';
  const imageUrl = req.file ? req.file.path : null;

  db.query(
    'INSERT INTO chats (sender_id, receiver_id, content, image_url) VALUES (?, ?, ?, ?)',
    [senderId, receiverId, content, imageUrl],
    (err) => {
      if (err) return res.status(500).json({ error: 'Send failed' });
      res.json({ success: true });
    }
  );
};

exports.markAsRead = (req, res) => {
  const userId = req.params.userId;
  db.query(
    'UPDATE chats SET is_read = 1 WHERE sender_id = ? AND receiver_id = 1',
    [userId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to mark as read' });
      res.json({ success: true });
    }
  );
};
