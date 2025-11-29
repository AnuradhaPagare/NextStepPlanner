const mongoose = require("mongoose");

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  moodScore: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  note: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure one mood entry per user per day
moodSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Mood", moodSchema);
