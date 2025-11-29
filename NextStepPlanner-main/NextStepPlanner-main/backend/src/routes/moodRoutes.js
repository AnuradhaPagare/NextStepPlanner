const express = require("express");
const Mood = require("../models/Mood");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Add a mood entry
router.post("/", async (req, res) => {
  try {
    const { moodScore, note, date } = req.body;

    if (!moodScore || moodScore < 1 || moodScore > 10) {
      return res
        .status(400)
        .json({ message: "Mood score must be between 1 and 10" });
    }

    const moodDate = date ? new Date(date) : new Date();
    moodDate.setHours(0, 0, 0, 0); // Set to start of day

    // Check if mood already exists for this date
    const existingMood = await Mood.findOne({
      userId: req.user._id,
      date: moodDate,
    });

    if (existingMood) {
      // Update existing mood
      existingMood.moodScore = moodScore;
      existingMood.note = note || "";
      await existingMood.save();
      return res.json(existingMood);
    }

    // Create new mood entry
    const mood = new Mood({
      userId: req.user._id,
      date: moodDate,
      moodScore,
      note: note || "",
    });

    await mood.save();
    res.status(201).json(mood);
  } catch (error) {
    console.error("Add mood error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get mood history
router.get("/history", async (req, res) => {
  try {
    const { limit = 30, startDate, endDate } = req.query;

    let query = { userId: req.user._id };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const moods = await Mood.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.json(moods);
  } catch (error) {
    console.error("Get mood history error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get mood data for a specific month
router.get("/month/:year/:month", async (req, res) => {
  try {
    const { year, month } = req.params;

    // Create start and end dates for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const moods = await Mood.find({
      userId: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 });

    res.json(moods);
  } catch (error) {
    console.error("Get month mood error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get today's mood
router.get("/today", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mood = await Mood.findOne({
      userId: req.user._id,
      date: today,
    });

    res.json(mood);
  } catch (error) {
    console.error("Get today mood error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get mood statistics
router.get("/stats", async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.user._id });

    if (moods.length === 0) {
      return res.json({
        average: 0,
        total: 0,
        distribution: {},
      });
    }

    const total = moods.length;
    const sum = moods.reduce((acc, mood) => acc + mood.moodScore, 0);
    const average = Math.round((sum / total) * 10) / 10;

    // Calculate distribution
    const distribution = {};
    for (let i = 1; i <= 10; i++) {
      distribution[i] = moods.filter((mood) => mood.moodScore === i).length;
    }

    // Get recent trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMoods = moods.filter((mood) => mood.date >= sevenDaysAgo);
    const recentAverage =
      recentMoods.length > 0
        ? Math.round(
            (recentMoods.reduce((acc, mood) => acc + mood.moodScore, 0) /
              recentMoods.length) *
              10
          ) / 10
        : 0;

    res.json({
      average,
      recentAverage,
      total,
      distribution,
      recentCount: recentMoods.length,
    });
  } catch (error) {
    console.error("Get mood stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a mood entry
router.put("/:id", async (req, res) => {
  try {
    const { moodScore, note } = req.body;

    const mood = await Mood.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!mood) {
      return res.status(404).json({ message: "Mood entry not found" });
    }

    if (moodScore !== undefined) {
      if (moodScore < 1 || moodScore > 10) {
        return res
          .status(400)
          .json({ message: "Mood score must be between 1 and 10" });
      }
      mood.moodScore = moodScore;
    }

    if (note !== undefined) {
      mood.note = note;
    }

    await mood.save();
    res.json(mood);
  } catch (error) {
    console.error("Update mood error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a mood entry
router.delete("/:id", async (req, res) => {
  try {
    const mood = await Mood.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!mood) {
      return res.status(404).json({ message: "Mood entry not found" });
    }

    res.json({ message: "Mood entry deleted successfully" });
  } catch (error) {
    console.error("Delete mood error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
