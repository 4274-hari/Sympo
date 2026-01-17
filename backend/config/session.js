const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
require("dotenv").config();

module.exports = session({
  store: new pgSession({
    conObject: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: String(process.env.DB_PASSWORD), // 🔑 MUST be string
      database: process.env.DB_NAME
    },
    tableName: "user_sessions"
  }),

  secret: process.env.SESSION_SECRET || "sympo_secret_key",
  resave: false,
  saveUninitialized: false,

  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,              // set true in HTTPS
    maxAge: 1000 * 60 * 60 * 8   // 8 hours
  }
});
