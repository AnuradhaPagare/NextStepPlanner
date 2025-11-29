const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  extractedText: {
    type: String,
    required: true,
  },
  keywordsFound: [
    {
      type: String,
    },
  ],
  keywordsMissing: [
    {
      type: String,
    },
  ],
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  selectedBranch: {
    type: String,
    default: null,
  },
  selectedJobRole: {
    type: String,
    default: null,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);
