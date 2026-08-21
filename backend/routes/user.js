const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Task = require('../models/Task');

// GET user XP and streak (query param: userId)
router.get('/stats', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }
    const user = await User.findById(userId).select('name avatar level xp streak');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET next upcoming alarm/task (closest deadline, not completed)
router.get('/next-alarm', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId query parameter is required' });
    }
    const now = new Date();
    const task = await Task.findOne({
      user: userId,
      isCompleted: false,
      deadline: { $gte: now },
    }).sort({ deadline: 1 });

    if (!task) {
      return res.json({ message: 'No upcoming tasks', task: null });
    }
    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
