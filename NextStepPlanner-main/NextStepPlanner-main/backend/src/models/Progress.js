const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  domain: {
    type: String,
    required: true,
    enum: ["Web Development", "AI/ML", "Data Science", "Mobile Development", "DevOps", "Cybersecurity"],
  },
  quizAttempts: [{
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    score: {
      type: Number,
      required: true,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  completedSteps: [{
    stepNumber: {
      type: Number,
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  totalProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  lastActivity: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

progressSchema.index({ userId: 1, domain: 1 });

module.exports = mongoose.model("Progress", progressSchema);

