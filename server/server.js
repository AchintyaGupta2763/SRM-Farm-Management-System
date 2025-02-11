require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const attendanceRoutes = require("./routes/attendanceRoutes");
const memberRoutes = require("./routes/memberRoutes");
const dailyMemorandumRoutes = require("./routes/dailyMemorandumRoutes");
const farmProducesRoutes = require("./routes/farmProducesRoutes");
const forecastRoutes = require("./routes/forecastRoutes");
const programmeRoutes = require("./routes/programmeRoutes");
const purchaseRegisterRoutes = require("./routes/purchaseRegisterRoutes");
const stockRegisterRoutes = require("./routes/stockRegisterRoutes")
const farmToolsMovementRoutes = require("./routes/farmToolsMovementRoutes")
const movementRegisterRoutes = require("./routes/movementRegisterRoutes")
const auth = require('./routes/auth')

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MongoDB connection string is missing.");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/attendance", attendanceRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/daily-memorandum", dailyMemorandumRoutes);
app.use("/api/farm-produces", farmProducesRoutes);
app.use("/api/forecast", forecastRoutes);
app.use("/api/programme", programmeRoutes);
app.use("/api/purchase-register", purchaseRegisterRoutes);
app.use("/api/stock-register", stockRegisterRoutes);
app.use("/api/farm-tools", farmToolsMovementRoutes);
app.use("/api/movement-register", movementRegisterRoutes);
app.use("/api/auth", auth);

// MongoDB Connection
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
