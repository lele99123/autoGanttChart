const express = require('express');
const router = express.Router();
const { StudyPlan, StudyTask } = require('../models');

// Get all study plans
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    
    // 如果提供了日期参数，按日期筛选
    const whereClause = date ? { planDate: date } : {};
    
    const plans = await StudyPlan.findAll({
      where: whereClause,
      include: [StudyTask],
      order: [['planDate', 'DESC']]
    });
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Get a specific study plan with its tasks
router.get('/:id', async (req, res) => {
  try {
    const plan = await StudyPlan.findByPk(req.params.id, {
      include: [StudyTask]
    });
    
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
    const plan = await StudyPlan.create({
      name,
      planDate
    });
    
    // Create tasks if provided
    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
      const tasksWithPlanId = tasks.map(task => ({
        ...task,
        planId: plan.id
      }));
      
      await StudyTask.bulkCreate(tasksWithPlanId);
    }
    
    // Return the created plan with its tasks
    const createdPlan = await StudyPlan.findByPk(plan.id, {
      include: [StudyTask]
    });
    
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
    const plan = await StudyPlan.findByPk(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    // Update plan properties
    if (name) plan.name = name;
    if (planDate) plan.planDate = planDate;
    
    await plan.save();
    
    // 如果提供了任务，更新任务
    if (tasks && Array.isArray(tasks) && tasks.length > 0) {
      // 删除现有任务
      await StudyTask.destroy({
        where: {
          planId: plan.id
        }
      });
      
      // 创建新任务
      const tasksWithPlanId = tasks.map(task => ({
        ...task,
        planId: plan.id
      }));
      
      await StudyTask.bulkCreate(tasksWithPlanId);
    }
    
    // 返回更新后的计划及其任务
    const updatedPlan = await StudyPlan.findByPk(plan.id, {
      include: [StudyTask]
    });
    
    res.json(updatedPlan);
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

// Delete a study plan
router.delete('/:id', async (req, res) => {
  try {
    const plan = await StudyPlan.findByPk(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    
    await plan.destroy();
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Failed to delete plan' });
  }
});

module.exports = router;
