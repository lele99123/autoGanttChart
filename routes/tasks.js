const express = require('express');
const router = express.Router();
const { StudyTask } = require('../models');

// Get all tasks for a specific plan
router.get('/plan/:planId', async (req, res) => {
  try {
    const tasks = await StudyTask.findAll({
      where: {
        planId: req.params.planId
      },
      order: [['startTime', 'ASC']]
    });
    
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Get a specific task
router.get('/:id', async (req, res) => {
  try {
    const task = await StudyTask.findByPk(req.params.id);
    
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
    const { planId, subject, chapters, content, startTime, durationTime } = req.body;
    
    if (!planId || !subject || !startTime || !durationTime) {
      return res.status(400).json({ 
        error: 'PlanId, subject, startTime, and durationTime are required' 
      });
    }
    
    const task = await StudyTask.create({
      planId,
      subject,
      chapters,
      content,
      startTime,
      durationTime
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
    const { subject, chapters, content, startTime, durationTime } = req.body;
    const task = await StudyTask.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Update task properties
    if (subject) task.subject = subject;
    if (chapters !== undefined) task.chapters = chapters;
    if (content !== undefined) task.content = content;
    if (startTime) task.startTime = startTime;
    if (durationTime) task.durationTime = durationTime;
    
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
    const task = await StudyTask.findByPk(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    await task.destroy();
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
