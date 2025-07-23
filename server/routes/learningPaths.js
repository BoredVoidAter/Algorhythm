
const express = require('express');
const router = express.Router();
const { LearningPath, LearningPathSnippet, UserLearningPathProgress, Snippet, User, Badge } = require('../models');
const authenticateToken = require('../middleware/auth');

// Create a new learning path
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, difficulty, snippetIds } = req.body;
    const creatorId = req.user.id;

    const learningPath = await LearningPath.create({
      title,
      description,
      difficulty,
      creatorId
    });

    if (snippetIds && snippetIds.length > 0) {
      const learningPathSnippets = snippetIds.map((snippetId, index) => ({
        learningPathId: learningPath.id,
        snippetId,
        order: index + 1
      }));
      await LearningPathSnippet.bulkCreate(learningPathSnippets);
    }

    res.status(201).json(learningPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all learning paths
router.get('/', async (req, res) => {
  try {
    const learningPaths = await LearningPath.findAll({
      include: [
        { model: User, attributes: ['id', 'email'] },
        { model: LearningPathSnippet, include: [{ model: Snippet }] }
      ]
    });
    res.status(200).json(learningPaths);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific learning path by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const learningPath = await LearningPath.findByPk(id, {
      include: [
        { model: User, attributes: ['id', 'email'] },
        { model: LearningPathSnippet, include: [{ model: Snippet }], order: [[LearningPathSnippet, 'order', 'ASC']] }
      ]
    });
    if (!learningPath) {
      return res.status(404).json({ message: 'Learning Path not found' });
    }
    res.status(200).json(learningPath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in a learning path
router.post('/:id/enroll', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const learningPath = await LearningPath.findByPk(id);
    if (!learningPath) {
      return res.status(404).json({ message: 'Learning Path not found' });
    }

    const [userProgress, created] = await UserLearningPathProgress.findOrCreate({
      where: { userId, learningPathId: id },
      defaults: { completed: false }
    });

    if (!created) {
      return res.status(409).json({ message: 'Already enrolled in this learning path' });
    }

    res.status(201).json(userProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user progress in a learning path
router.put('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { lastCompletedSnippetId, completed } = req.body;
    const userId = req.user.id;

    const userProgress = await UserLearningPathProgress.findOne({
      where: { userId, learningPathId: id }
    });

    if (!userProgress) {
      return res.status(404).json({ message: 'User not enrolled in this learning path' });
    }

    await userProgress.update({ lastCompletedSnippetId, completed });

    // If completed, award a badge (example: a generic badge for now)
    if (completed) {
      const [badge, created] = await Badge.findOrCreate({
        where: { name: `Completed: ${learningPath.title}` },
        defaults: { description: `Completed the ${learningPath.title} learning path` }
      });
      // TODO: Associate badge with user (e.g., through a UserBadge model)
    }

    res.status(200).json(userProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
