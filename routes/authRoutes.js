const express = require("express");
const passport = require("passport");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/register", auth.register);
router.post("/login", auth.login);
router.get("/logout", auth.logout);
router.get('/user', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { id, name, email, role } = req.user;
  res.json({ id, name, email, role });
});
// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    res.redirect(req.user.role === "admin" ? "/admin" : "/dashboard");
  }
);

module.exports = router;