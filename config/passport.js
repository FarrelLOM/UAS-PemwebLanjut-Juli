const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");

function initPassport(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/auth/google/callback`,
      },
      function (accessToken, refreshToken, profile, done) {
        const email = profile.emails[0].value;
        db.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (err, results) => {
            if (err) return done(err);
            if (results.length > 0) {
              return done(null, results[0]);
            } else {
              const newUser = {
                name: profile.displayName,
                email,
                password: "",
                role: "user",
              };
              db.query("INSERT INTO users SET ?", newUser, (err) => {
                if (err) return done(err);
                return done(null, { ...newUser, id: result.insertId });
              });
            }
          }
        );
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) return done(err);
      done(null, results[0]);
    });
  });
}

module.exports = initPassport;
