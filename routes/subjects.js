const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const db = require('../db');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find()
      .sort({ subjectName: 1 });
    
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Get a specific subject
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ error: 'Failed to fetch subject' });
  }
});

// Create a new subject
router.post('/', async (req, res) => {
  try {
    const { subjectName, subjectCode, subjectDescription } = req.body;
    
    if (!subjectName || !subjectCode) {
      return res.status(400).json({ error: 'Subject name and code are required' });
    }
    
    // Create the subject
    const subject = await Subject.create({
      subjectName,
      subjectCode,
      subjectDescription,
      subjectStatus: 'active'
    });
    
    res.status(201).json(subject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

// Update a subject
router.put('/:id', async (req, res) => {
  try {
    const { subjectName, subjectCode, subjectDescription, subjectStatus } = req.body;
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    // Update subject properties
    if (subjectName) subject.subjectName = subjectName;
    if (subjectCode) subject.subjectCode = subjectCode;
    if (subjectDescription !== undefined) subject.subjectDescription = subjectDescription;
    if (subjectStatus) subject.subjectStatus = subjectStatus;
    
    await subject.save();
    
    res.json(subject);
  } catch (error) {
    console.error('Error updating subject:', error);
    res.status(500).json({ error: 'Failed to update subject' });
  }
});

// Delete a subject
router.delete('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    await subject.deleteOne();
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

module.exports = router;
