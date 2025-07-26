const db = require("../config/db");

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, users) => {
    if (users.length > 0) return res.send("Email already exists");
    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, password, "user"],
      (err) => {
        if (err) throw err;
        res.redirect("/login");
      }
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, users) => {
      if (err) throw err;
      if (users.length === 0) return res.send("Invalid credentials");
      req.login(users[0], (err) => {
        if (err) throw err;
        res.redirect(users[0].role === "admin" ? "/admin" : "/dashboard");
      });
    }
  );
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
};
exports.googleAuth = (req, res) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
};