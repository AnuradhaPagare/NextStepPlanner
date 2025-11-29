const express = require("express");
const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multerMiddleware");
const {
  getKeywordsForRole,
  getBranches,
  getJobRolesForBranch,
} = require("../utils/atsKeywords");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Function to get keywords based on branch and job role using the new cascading system
const getSelectedKeywords = (branch, jobRole) => {
  return getKeywordsForRole(branch, jobRole);
};

// Function to calculate ATS score with selected keywords
const calculateATSScore = (extractedText, selectedKeywords) => {
  const text = extractedText.toLowerCase();
  const foundKeywords = [];
  const missingKeywords = [];

  selectedKeywords.forEach((keyword) => {
    if (text.includes(keyword.toLowerCase())) {
      foundKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const score = Math.round(
    (foundKeywords.length / selectedKeywords.length) * 100
  );

  return {
    score,
    foundKeywords,
    missingKeywords,
    totalKeywords: selectedKeywords.length,
  };
};

// Upload and analyze resume with branch and job role selection
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { branch, jobRole } = req.body;

    // Extract text from PDF
    const pdfData = await pdfParse(req.file.buffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "Could not extract text from PDF" });
    }

    // Get selected keywords based on branch and job role
    const selectedKeywords = getSelectedKeywords(branch, jobRole);

    // Calculate ATS score with selected keywords
    const atsResult = calculateATSScore(extractedText, selectedKeywords);

    // Save resume analysis to database
    const resume = new Resume({
      userId: req.user._id,
      fileName: req.file.originalname,
      fileUrl: `data:application/pdf;base64,${req.file.buffer.toString(
        "base64"
      )}`, // Store as base64 for demo
      extractedText,
      keywordsFound: atsResult.foundKeywords,
      keywordsMissing: atsResult.missingKeywords,
      score: atsResult.score,
      selectedBranch: branch,
      selectedJobRole: jobRole,
    });

    await resume.save();

    // Return analysis results
    res.status(201).json({
      id: resume._id,
      fileName: resume.fileName,
      score: atsResult.score,
      keywordsFound: atsResult.foundKeywords,
      keywordsMissing: atsResult.missingKeywords,
      totalKeywords: atsResult.totalKeywords,
      selectedBranch: resume.selectedBranch,
      selectedJobRole: resume.selectedJobRole,
      uploadedAt: resume.uploadedAt,
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    res.status(500).json({ message: "Error processing resume" });
  }
});

// Get all resume analyses for user
router.get("/history", async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select("-extractedText -fileUrl") // Exclude large fields
      .sort({ uploadedAt: -1 });

    res.json(resumes);
  } catch (error) {
    console.error("Get resume history error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get specific resume analysis
router.get("/:id", async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).select("-fileUrl"); // Exclude file content

    if (!resume) {
      return res.status(404).json({ message: "Resume analysis not found" });
    }

    res.json(resume);
  } catch (error) {
    console.error("Get resume error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete resume analysis
router.delete("/:id", async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume analysis not found" });
    }

    res.json({ message: "Resume analysis deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get ATS keywords structure for the cascading dropdowns
router.get("/keywords/list", (req, res) => {
  const branches = getBranches();
  res.json({
    branches,
    // Include endpoints for getting job roles dynamically
    endpoints: {
      jobRoles: "/resume/keywords/job-roles",
    },
  });
});

// Get job roles for a specific branch
router.get("/keywords/job-roles", (req, res) => {
  const { branchId } = req.query;

  if (!branchId) {
    return res.status(400).json({ error: "branchId is required" });
  }

  const jobRoles = getJobRolesForBranch(branchId);
  res.json({ jobRoles });
});

module.exports = router;
