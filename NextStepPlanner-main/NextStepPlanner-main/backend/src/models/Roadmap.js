const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    unique: true,
    enum: ["Web Development", "AI/ML", "Data Science", "Mobile Development", "DevOps", "Cybersecurity"],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  steps: [{
    stepNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    estimatedTime: {
      type: String,
      required: true,
    },
    resources: [{
      type: {
        type: String,
        enum: ["video", "article", "tutorial", "documentation"],
      },
      title: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
    }],
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
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

module.exports = mongoose.model("Roadmap", roadmapSchema);

