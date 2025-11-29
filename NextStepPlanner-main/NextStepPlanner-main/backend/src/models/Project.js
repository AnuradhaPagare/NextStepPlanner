const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
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
  stepNumber: {
    type: Number,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["planned", "in-progress", "completed"],
    default: "planned",
  },
  githubUrl: {
    type: String,
  },
  liveUrl: {
    type: String,
  },
  tags: [{
    type: String,
  }],
  completedAt: {
    type: Date,
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

projectSchema.index({ userId: 1, domain: 1 });

module.exports = mongoose.model("Project", projectSchema);

