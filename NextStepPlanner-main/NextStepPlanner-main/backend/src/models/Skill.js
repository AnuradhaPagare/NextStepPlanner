const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
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
  skillName: {
    type: String,
    required: true,
    trim: true,
  },
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  currentStep: {
    type: Number,
    default: 0,
  },
  completedSteps: [{
    type: Number,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

skillSchema.index({ userId: 1, domain: 1 });

module.exports = mongoose.model("Skill", skillSchema);

