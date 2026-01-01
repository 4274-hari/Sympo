const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const { ensureDatabaseExists } = require("./migrations/database");
const { tablecreation } = require("./migrations/table");

const routes = require("./routes/index");

const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);

const errorHandler = require("./middlewares/error_handler"); // ✅ NEW

const app = express();

/* ===============================
   MIDDLEWARES
=============================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===============================
   SESSION CONFIG
=============================== */
app.use(
  session({
    store: new pgSession({
      conString: process.env.DATABASE_URL, // or pg config
      tableName: "session"
    }),
    secret: process.env.SESSION_SECRET || "sympo_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,        // set true in HTTPS
      httpOnly: true,
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  })
);

/* ===============================
   ROUTES
=============================== */
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

app.use("/api", routes);

/* ===============================
   GLOBAL ERROR HANDLER (MUST BE LAST)
=============================== */
app.use(errorHandler); // ✅ VERY IMPORTANT

/* ===============================
   SERVER START
=============================== */
async function startServer() {
  try {
    console.log("🚀 Initializing server...");

    // 1️⃣ Ensure DB exists
    await ensureDatabaseExists();

    // 2️⃣ Run migrations
    await tablecreation();

    // 3️⃣ Start server
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// start app
startServer();
