const express = require("express");
const Pomodoro = require("../models/Pomodoro");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Start a pomodoro session
router.post("/start", async (req, res) => {
  try {
    const { type = "work", duration = 25 } = req.body;

    // Check if there's an active session
    const activeSession = await Pomodoro.findOne({
      userId: req.user._id,
      endTime: null,
      completed: false,
    });

    if (activeSession) {
      return res
        .status(400)
        .json({ message: "There is already an active pomodoro session" });
    }

    const pomodoro = new Pomodoro({
      userId: req.user._id,
      startTime: new Date(),
      type,
      duration,
    });

    await pomodoro.save();
    res.status(201).json(pomodoro);
  } catch (error) {
    console.error("Start pomodoro error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Stop/Complete a pomodoro session
router.put("/stop/:id", async (req, res) => {
  try {
    const { completed = true } = req.body;

    const pomodoro = await Pomodoro.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!pomodoro) {
      return res.status(404).json({ message: "Pomodoro session not found" });
    }

    if (pomodoro.endTime) {
      return res
        .status(400)
        .json({ message: "Pomodoro session already ended" });
    }

    pomodoro.endTime = new Date();
    pomodoro.completed = completed;

    await pomodoro.save();
    res.json(pomodoro);
  } catch (error) {
    console.error("Stop pomodoro error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get active pomodoro session
router.get("/active", async (req, res) => {
  try {
    const activeSession = await Pomodoro.findOne({
      userId: req.user._id,
      endTime: null,
      completed: false,
    }).sort({ startTime: -1 });

    res.json(activeSession);
  } catch (error) {
    console.error("Get active pomodoro error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pomodoro history
router.get("/history", async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    const pomodoros = await Pomodoro.find({ userId: req.user._id })
      .sort({ startTime: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Pomodoro.countDocuments({ userId: req.user._id });

    res.json({
      pomodoros,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get pomodoro history error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get pomodoro statistics
router.get("/stats", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's stats
    const todayPomodoros = await Pomodoro.find({
      userId: req.user._id,
      startTime: { $gte: today, $lt: tomorrow },
      completed: true,
    });

    // This week's stats
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const weekPomodoros = await Pomodoro.find({
      userId: req.user._id,
      startTime: { $gte: weekStart },
      completed: true,
    });

    // Total stats
    const totalPomodoros = await Pomodoro.countDocuments({
      userId: req.user._id,
      completed: true,
    });

    res.json({
      today: {
        count: todayPomodoros.length,
        totalMinutes: todayPomodoros.reduce((sum, p) => sum + p.duration, 0),
      },
      thisWeek: {
        count: weekPomodoros.length,
        totalMinutes: weekPomodoros.reduce((sum, p) => sum + p.duration, 0),
      },
      total: {
        count: totalPomodoros,
      },
    });
  } catch (error) {
    console.error("Get pomodoro stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
