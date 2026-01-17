const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const { ensureDatabaseExists } = require("./migrations/database");
const { tablecreation } = require("./migrations/table");

const routes = require("./routes/index");

const errorHandler = require("./middlewares/error_handler"); // ✅ NEW

const cors = require("cors")
const path = require("path")

const sessionMiddleware = require("./config/session");

const app = express();


/* ===============================
   MIDDLEWARES
=============================== */
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


app.use(express.urlencoded({ extended: true }));

/* ===============================
   SESSION CONFIG
=============================== */
app.use(sessionMiddleware); // ✅ THIS IS REQUIRED


/* ===============================
   ROUTES
=============================== */
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

app.use("/api", routes);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

//TESTING FOR SESSION
app.get("/_session-test", (req, res) => {
  res.json({
    sessionExists: !!req.session,
    sessionId: req.sessionID
  });
});


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
