const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.warn("⚠️  WARNING: JWT_SECRET is not set in .env file");
  console.warn("⚠️  Using default JWT_SECRET for development (NOT SECURE FOR PRODUCTION)");
  process.env.JWT_SECRET = "dev-secret-key-change-in-production-" + Date.now();
}

// Import routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const pomodoroRoutes = require("./routes/pomodoroRoutes");
const moodRoutes = require("./routes/moodRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const skillRoutes = require("./routes/skillRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration - Allow any localhost port for development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allow any localhost origin for development
    if (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("https://localhost:")
    ) {
      return callback(null, true);
    }

    // Allow specific production origins (add your production URLs here)
    const allowedOrigins = [
      "https://your-production-domain.com",
      // Add more production URLs as needed
    ];

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: false,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import seed data
const { seedRoadmaps, seedQuizzes } = require("./utils/seedData");

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/nextstep-planner"
  )
  .then(async () => {
    console.log("✅ Connected to MongoDB");
    // Seed initial data - quizzes first, then roadmaps (so roadmaps can link to quizzes)
    await seedQuizzes();
    await seedRoadmaps();
  })
  .catch((error) => console.error("❌ MongoDB connection error:", error));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/mood", moodRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/skills", skillRoutes);

// Root route - API information
app.get("/", (req, res) => {
  res.json({
    message: "NextStep Planner API Server",
    status: "Running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      tasks: "/api/tasks",
      pomodoro: "/api/pomodoro",
      mood: "/api/mood",
      resume: "/api/resume",
      skills: "/api/skills",
    },
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
  });
});

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Status: http://localhost:${PORT}/api/health`);
});

module.exports = app;
