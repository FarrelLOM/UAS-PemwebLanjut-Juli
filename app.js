const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
require("dotenv").config();

const app = express();

// DB & Passport
require("./config/db");
require("./config/passport")(passport);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Auth Middleware
const { ensureAuthenticated, ensureRole } = require("./middleware/authMiddleware");

const mapRoutes = require("./routes/mapRoutes");
app.use("/map", mapRoutes);

app.get("/map", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views/map.html"));
});

app.get("/map-key", (req, res) => {
  res.json({ key: process.env.AZURE_MAPS_KEY });
});

// Routes
app.use("/auth", require("./routes/authRoutes"));
app.use("/user", require("./routes/userRoutes"));
app.use("/admin", require("./routes/adminRoutes"));
app.use("/donasi", require("./routes/donasiRoutes"));
app.use("/withdraw", require("./routes/withdrawRoutes"));
app.use("/map", require("./routes/mapRoutes"));
app.use("/admin/withdraw", require("./routes/adminWithdrawRoutes"));

// Halaman Leaderboard
app.get("/leaderboard", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views/leaderboard.html"));
});

const chatRoutes = require("./routes/chatRoutes");
app.use("/chat", chatRoutes);

app.get("/chat", ensureAuthenticated, (req, res) => {
  if (req.user.role === "admin") {
    res.sendFile(path.join(__dirname, "views/adminChat.html"));
  } else {
    res.sendFile(path.join(__dirname, "views/chat.html"));
  }
});

app.get("/profile", ensureAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "views/profile.html"));
});

// Static HTML Pages
const sendView = (file) => (req, res) => res.sendFile(path.join(__dirname, "views", file));

app.get("/forum", ensureAuthenticated, sendView("forum.html"));
app.use("/forum", require("./routes/forumRoutes"));

app.get("/", sendView("index.html"));
app.get("/login", sendView("login.html"));
app.get("/register", sendView("register.html"));
app.get("/dashboard", ensureAuthenticated, sendView("dashboard.html"));
app.get("/admin", ensureAuthenticated, ensureRole("admin"), sendView("adminDashboard.html"));
app.get("/form-pengajuan", ensureAuthenticated, sendView("formPengajuanProyek.html"));
app.get("/donasi", ensureAuthenticated, sendView("detailProyek.html"));
app.get("/map", ensureAuthenticated, sendView("map.html"));
app.get("/explore", ensureAuthenticated, sendView("exploreProyek.html"));
app.get("/withdraw", ensureAuthenticated, sendView("withdraw.html"));

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));