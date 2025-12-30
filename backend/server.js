const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const {ensureDatabaseExists} = require('./migrations/database');
const {tablecreation} = require('./migrations/table')
const routes = require("./routes/index")
const cors = require("cors")

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

app.use("/api", routes);

async function startServer() {  
  try {
    console.log("Initializing server...");

    // 1️⃣ Ensure DB exists
    await ensureDatabaseExists();

    // 2️⃣ Run migrations
    await tablecreation();

    // 3️⃣ Start server
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
}
// start app
startServer();