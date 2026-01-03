const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

console.log("🔄 Starting server...");

//running worker//


// Test route to verify server is working
app.get("/", (req, res) => {
  res.json({ message: "Server is working!", timestamp: new Date().toISOString() });
});

// Add a middleware to log all incoming requests BEFORE loading routes
app.use((req, res, next) => {
  console.log(`🌐 Incoming request: ${req.method} ${req.url}`);
  next();
});

// Debug: Log when routes are being loaded
console.log("🔄 Loading routes...");

// Load routes with detailed debugging
try {
  console.log("📂 Attempting to load reports router...");
  const reportsRouter = require("./routes/reports");
  console.log("✅ Reports router loaded successfully");
  app.use("/api/reports", reportsRouter);
  console.log("✅ Reports router mounted on /api/reports");
  
  console.log("📂 Attempting to load branches router...");
  const branchesRouter = require("./routes/branches");
  console.log("✅ Branches router loaded successfully");
  console.log("🔍 Branches router type:", typeof branchesRouter);
  app.use("/api/branches", branchesRouter);
  console.log("✅ Branches router mounted on /api/branches");
  
  console.log("🎯 Routes loading completed");

  const campaignRouter=require("./routes/campaign")
  console.log("✅ Campaign router loaded successfully");
  console.log("🔍 Campaign router type:", typeof campaignRouter);
  require("./workers/campaignWorker")
  app.use("/api/campaign",campaignRouter)
  console.log("Campaign router loaded:", require("./routes/campaign"));


  const authRouter=require("./routes/user")
  console.log("✅ auth router loaded successfully");
  app.use("/api/auth",authRouter)
  console.log("auth router loaded:", require("./routes/user"));

  const specialCampaignRouter = require("./routes/specialCampaign");
  console.log("✅ Special Campaign router loaded successfully");
  app.use("/api/special-campaigns", specialCampaignRouter);
  console.log("Special Campaign router mounted on /api/special-campaigns");


  
} catch (error) {
  console.error("❌ Error loading routes:", error);
  console.error("❌ Stack:", error.stack);
}

// Simple database connection
const connectDB = async () => {
  try {
    console.log("🔌 Attempting to connect to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campaignDB', {
      dbName: "campaignDB",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};


connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error middleware triggered:", err);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message || "Something went wrong",
  });
});


app.use((req, res) => {
  console.log("❌ 404 hit for:", req.method, req.url);
  
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: "The requested resource was not found",
  });
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campaignDB', {
      dbName: "campaignDB", useNewUrlParser: true, useUnifiedTopology: true
    });
    console.log("✅ Worker connected to MongoDB");
  } catch (err) { console.error("❌ MongoDB error:", err); }
})();


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 Test at: http://localhost:${PORT}`);
  console.log(`🌐 Test branches at: http://localhost:${PORT}/api/branches`);
  console.log(`🧪 Test reports at: http://localhost:${PORT}/api/reports`);
});



