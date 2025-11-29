const express = require("express");
const Skill = require("../models/Skill");
const Roadmap = require("../models/Roadmap");
const Quiz = require("../models/Quiz");
const Project = require("../models/Project");
const Progress = require("../models/Progress");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all roadmaps
router.get("/roadmaps", async (req, res) => {
  try {
    const roadmaps = await Roadmap.find();
    res.json(roadmaps);
  } catch (error) {
    console.error("Get roadmaps error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get roadmap by domain
router.get("/roadmaps/:domain", async (req, res) => {
  try {
    const domain = decodeURIComponent(req.params.domain);
    const roadmap = await Roadmap.findOne({ domain });
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }
    res.json(roadmap);
  } catch (error) {
    console.error("Get roadmap error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's skills
router.get("/skills", async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user._id });
    res.json(skills);
  } catch (error) {
    console.error("Get skills error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create or update user skill
router.post("/skills", async (req, res) => {
  try {
    const { domain, skillName, level } = req.body;

    if (!domain || !skillName) {
      return res.status(400).json({ message: "Domain and skill name are required" });
    }

    let skill = await Skill.findOne({
      userId: req.user._id,
      domain,
      skillName,
    });

    if (skill) {
      if (level) skill.level = level;
      skill.updatedAt = new Date();
      await skill.save();
    } else {
      skill = new Skill({
        userId: req.user._id,
        domain,
        skillName,
        level: level || "Beginner",
      });
      await skill.save();
    }

    res.status(201).json(skill);
  } catch (error) {
    console.error("Create skill error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update skill progress
router.put("/skills/:id/progress", async (req, res) => {
  try {
    const { progress, currentStep, completedSteps } = req.body;

    const skill = await Skill.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (progress !== undefined) skill.progress = progress;
    if (currentStep !== undefined) skill.currentStep = currentStep;
    if (completedSteps !== undefined) skill.completedSteps = completedSteps;
    skill.updatedAt = new Date();

    await skill.save();
    res.json(skill);
  } catch (error) {
    console.error("Update skill progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get quizzes for a domain and step
router.get("/quizzes/:domain/:stepNumber", async (req, res) => {
  try {
    const domain = decodeURIComponent(req.params.domain);
    const quiz = await Quiz.findOne({
      domain,
      stepNumber: parseInt(req.params.stepNumber),
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Get quiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Submit quiz attempt
router.post("/quizzes/:quizId/attempt", async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (!answers || !Array.isArray(answers) || answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: "Invalid answers array. All questions must be answered." });
    }

    let correct = 0;
    const results = quiz.questions.map((question, index) => {
      const userAnswer = answers[index];
      if (userAnswer === undefined || userAnswer === null || userAnswer < 0) {
        return {
          question: question.question,
          userAnswer: null,
          correctAnswer: question.correctAnswer,
          isCorrect: false,
          explanation: question.explanation,
        };
      }
      const isCorrect = userAnswer === question.correctAnswer;
      if (isCorrect) correct++;
      return {
        question: question.question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
      };
    });

    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // Update progress
    let progress = await Progress.findOne({
      userId: req.user._id,
      domain: quiz.domain,
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        domain: quiz.domain,
      });
    }

    progress.quizAttempts.push({
      quizId: quiz._id,
      score,
      passed,
    });

    progress.lastActivity = new Date();
    await progress.save();

    res.json({
      score,
      passed,
      results,
      totalQuestions: quiz.questions.length,
      correctAnswers: correct,
    });
  } catch (error) {
    console.error("Submit quiz error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user's projects
router.get("/projects", async (req, res) => {
  try {
    const { domain } = req.query;
    const query = { userId: req.user._id };
    if (domain) query.domain = domain;

    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error("Get projects error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create project
router.post("/projects", async (req, res) => {
  try {
    const { domain, stepNumber, title, description, status, githubUrl, liveUrl, tags } = req.body;

    if (!domain || !title || !description) {
      return res.status(400).json({ message: "Domain, title, and description are required" });
    }

    const project = new Project({
      userId: req.user._id,
      domain,
      stepNumber,
      title,
      description,
      status: status || "planned",
      githubUrl,
      liveUrl,
      tags: tags || [],
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    console.error("Create project error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update project
router.put("/projects/:id", async (req, res) => {
  try {
    const { title, description, status, githubUrl, liveUrl, tags } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (status !== undefined) {
      project.status = status;
      if (status === "completed") {
        project.completedAt = new Date();
      }
    }
    if (githubUrl !== undefined) project.githubUrl = githubUrl;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (tags !== undefined) project.tags = tags;
    project.updatedAt = new Date();

    await project.save();
    res.json(project);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete project
router.delete("/projects/:id", async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get user progress
router.get("/progress", async (req, res) => {
  try {
    const { domain } = req.query;
    const query = { userId: req.user._id };
    if (domain) query.domain = domain;

    const progress = await Progress.find(query);
    res.json(progress);
  } catch (error) {
    console.error("Get progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update progress (mark step as completed)
router.post("/progress/complete-step", async (req, res) => {
  try {
    const { domain, stepNumber } = req.body;

    if (!domain || stepNumber === undefined) {
      return res.status(400).json({ message: "Domain and step number are required" });
    }

    let progress = await Progress.findOne({
      userId: req.user._id,
      domain,
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user._id,
        domain,
      });
    }

    // Check if step already completed
    const stepExists = progress.completedSteps.some(
      (step) => step.stepNumber === stepNumber
    );

    if (!stepExists) {
      progress.completedSteps.push({
        stepNumber,
        completedAt: new Date(),
      });
    }

    progress.lastActivity = new Date();
    await progress.save();

    res.json(progress);
  } catch (error) {
    console.error("Update progress error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get dashboard stats
router.get("/dashboard", async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user._id });
    const projects = await Project.find({ userId: req.user._id });
    const progress = await Progress.find({ userId: req.user._id });

    const stats = {
      totalSkills: skills.length,
      activeSkills: skills.filter((s) => s.progress > 0 && s.progress < 100).length,
      completedSkills: skills.filter((s) => s.progress === 100).length,
      totalProjects: projects.length,
      completedProjects: projects.filter((p) => p.status === "completed").length,
      totalQuizzes: progress.reduce((sum, p) => sum + p.quizAttempts.length, 0),
      passedQuizzes: progress.reduce(
        (sum, p) => sum + p.quizAttempts.filter((a) => a.passed).length,
        0
      ),
      domains: [...new Set(skills.map((s) => s.domain))],
    };

    res.json(stats);
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

