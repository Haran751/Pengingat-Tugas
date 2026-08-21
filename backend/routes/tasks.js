const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks for a user (query param: userId)
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }
    const tasks = await Task.find({ user: userId }).sort({ deadline: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new task
router.post('/', async (req, res) => {
  try {
    const { title, priority, deadline, user } = req.body;
    if (!title || !deadline || !user) {
      return res.status(400).json({ message: 'title, deadline, and user are required' });
    }
    const task = new Task({ title, priority, deadline, user });
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const { title, priority, deadline, isCompleted } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (priority !== undefined) updateData.priority = priority;
    if (deadline !== undefined) updateData.deadline = deadline;
    if (isCompleted !== undefined) updateData.isCompleted = isCompleted;

    const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
