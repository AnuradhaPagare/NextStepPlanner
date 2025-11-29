const mongoose = require("mongoose");

const pomodoroSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  type: {
    type: String,
    enum: ["work", "short-break", "long-break"],
    default: "work",
  },
  duration: {
    type: Number, // in minutes
    default: 25,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pomodoro", pomodoroSchema);
