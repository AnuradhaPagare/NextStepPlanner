const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  domain: {
    type: String,
    required: true,
    enum: ["Web Development", "AI/ML", "Data Science", "Mobile Development", "DevOps", "Cybersecurity"],
  },
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
  },
  questions: [{
    question: {
      type: String,
      required: true,
    },
    options: [{
      type: String,
      required: true,
    }],
    correctAnswer: {
      type: Number,
      required: true,
    },
    explanation: {
      type: String,
    },
  }],
  passingScore: {
    type: Number,
    default: 70,
    min: 0,
    max: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

quizSchema.index({ domain: 1, stepNumber: 1 });

module.exports = mongoose.model("Quiz", quizSchema);

