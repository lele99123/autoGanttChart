const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const db = require('../db');

// Get all tasks for a specific plan
router.get('/plan/:planId', async (req, res) => {
  try {
    const tasks = await Task.find({
      planId: req.params.planId
    }).sort({ taskDate: 1 });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get a specific task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const { planId, taskName, taskDate, taskStatus } = req.body;
    
    if (!planId || !taskName || !taskDate) {
      return res.status(400).json({ 
        error: 'PlanId, taskName, and taskDate are required' 
      });
    }
    
    const task = await Task.create({
      planId,
      taskName,
      taskDate: new Date(taskDate),
      taskStatus: taskStatus || 'pending'
    });
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const { taskName, taskDate, taskStatus } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update task properties
    if (taskName) task.taskName = taskName;
    if (taskDate) task.taskDate = new Date(taskDate);
    if (taskStatus) task.taskStatus = taskStatus;
    
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await task.deleteOne();
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
