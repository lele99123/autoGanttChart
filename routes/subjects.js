const express = require('express');
const router = express.Router();
const { Subject, Chapter } = require('../models');

// Get all subjects with their chapters
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [Chapter],
      order: [
        ['name', 'ASC'],
        [Chapter, 'name', 'ASC']
      ]
    });
    
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Get a specific subject with its chapters
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id, {
      include: [Chapter],
      order: [
        [Chapter, 'name', 'ASC']
      ]
    });
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error) {
    console.error('Error fetching subject:', error);
    res.status(500).json({ error: 'Failed to fetch subject' });
  }
});

// Get all chapters for a specific subject
router.get('/:id/chapters', async (req, res) => {
  try {
    const chapters = await Chapter.findAll({
      where: {
        subjectId: req.params.id
      },
      order: [['name', 'ASC']]
    });
    
    res.json(chapters);
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
});

// Create a new subject
router.post('/', async (req, res) => {
  try {
    const { name, chapters } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    // Create the subject
    const subject = await Subject.create({ name });
    
    // Create chapters if provided
    if (chapters && Array.isArray(chapters) && chapters.length > 0) {
      const chaptersWithSubjectId = chapters.map(chapterName => ({
        name: chapterName,
        subjectId: subject.id
      }));
      
      await Chapter.bulkCreate(chaptersWithSubjectId);
    }
    
    // Return the created subject with its chapters
    const createdSubject = await Subject.findByPk(subject.id, {
      include: [Chapter],
      order: [
        [Chapter, 'name', 'ASC']
      ]
    });
    
    res.status(201).json(createdSubject);
  } catch (error) {
    console.error('Error creating subject:', error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

// Update a subject
router.put('/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const subject = await Subject.findByPk(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    // Update subject name
    if (name) subject.name = name;
    
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
    const subject = await Subject.findByPk(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    await subject.destroy();
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting subject:', error);
    res.status(500).json({ error: 'Failed to delete subject' });
  }
});

// Add a chapter to a subject
router.post('/:id/chapters', async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Chapter name is required' });
    }
    
    const subject = await Subject.findByPk(req.params.id);
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    const chapter = await Chapter.create({
      name,
      subjectId: subject.id
    });
    
    res.status(201).json(chapter);
  } catch (error) {
    console.error('Error adding chapter:', error);
    res.status(500).json({ error: 'Failed to add chapter' });
  }
});

module.exports = router;
