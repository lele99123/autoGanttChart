const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');
const Task = require('../models/Task');
const db = require('../db');

// Get all study plans
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    
    // 如果提供了日期参数，按日期筛选
    const query = date ? { planDate: new Date(date) } : {};
    
    const plans = await Plan.find(query)
      .populate('tasks')
      .sort({ planDate: -1 });
    
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get a specific study plan with its tasks
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate('tasks');
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Error fetching plan:', error);
    res.status(500).json({ error: 'Failed to fetch plan' });
  }
});

// Create a new study plan
router.post('/', async (req, res) => {
  try {
    const { name, planDate, tasks } = req.body;
    
    if (!name || !planDate) {
      return res.status(400).json({ error: 'Name and planDate are required' });
    }
    
    // Create the plan
    const plan = await Plan.create({
      planName: name,
      planDate: new Date(planDate)
    });
    
    // Create tasks if provided
    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
      const tasksWithPlanId = tasks.map(task => ({
        ...task,
        planId: plan._id,
        taskDate: new Date(task.taskDate)
      }));
      
      await Task.insertMany(tasksWithPlanId);
    }
    
    // Return the created plan with its tasks
    const createdPlan = await Plan.findById(plan._id)
      .populate('tasks');
    
    res.status(201).json(createdPlan);
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

// Update a study plan
router.put('/:id', async (req, res) => {
  try {
    const { name, planDate, tasks } = req.body;
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    // Update plan properties
    if (name) plan.planName = name;
    if (planDate) plan.planDate = new Date(planDate);
    
    await plan.save();
    
    // 如果提供了任务，更新任务
    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
      // 删除现有任务
      await Task.deleteMany({ planId: plan._id });
      
      // 创建新任务
      const tasksWithPlanId = tasks.map(task => ({
        ...task,
        planId: plan._id,
        taskDate: new Date(task.taskDate)
      }));
      
      await Task.insertMany(tasksWithPlanId);
    }
    
    // 返回更新后的计划及其任务
    const updatedPlan = await Plan.findById(plan._id)
      .populate('tasks');
    
    res.json(updatedPlan);
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// Delete a study plan
router.delete('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    // 删除关联的任务
    await Task.deleteMany({ planId: plan._id });
    
    // 删除计划
    await plan.deleteOne();
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

module.exports = router;
