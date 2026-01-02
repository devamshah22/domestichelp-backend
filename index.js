require("dotenv").config();
const express = require("express");
const cors = require("cors");

// DB connection
const connectDB = require("./config/db");

// Queue worker
const processEmailQueue = require("./workers/emailWorker");

// Routes
const registerRoute = require("./routes/register");

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Connect MongoDB Atlas
connectDB();

// Health check
app.get("/", (req, res) => {
  res.send("Domestic Help Backend Running ✅");
});

// Service registration route
app.use("/register", registerRoute);

// 🔁 Start background queue worker (every 10 seconds)
setInterval(() => {
  processEmailQueue();
}, 10000);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Domestic Help backend running on port ${PORT}`);
});
