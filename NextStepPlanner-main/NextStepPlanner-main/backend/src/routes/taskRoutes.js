const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Get all tasks for the authenticated user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get a specific task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new task
router.post("/", async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = new Task({
      userId: req.user._id,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      status: status || "pending",
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update a task
router.put("/:id", async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined)
      task.dueDate = dueDate ? new Date(dueDate) : null;
    if (status !== undefined) task.status = status;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
