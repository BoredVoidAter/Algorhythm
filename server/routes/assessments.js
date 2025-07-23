const express = require('express');
const authenticateToken = require('../middleware/auth');
const { Assessment, Submission, Badge, User, UserBadge } = require('../models');

const router = express.Router();

// Get all assessments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const assessments = await Assessment.findAll({
      include: [{ model: Badge, attributes: ['name', 'iconUrl'] }]
    });
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific assessment by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const assessment = await Assessment.findByPk(req.params.id, {
      include: [{ model: Badge, attributes: ['name', 'iconUrl'] }]
    });
    if (!assessment) {
      return res.status(404).json({ msg: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit an assessment
router.post('/:id/submit', authenticateToken, async (req, res) => {
  const { code } = req.body;
  const userId = req.user.userId;
  const assessmentId = req.params.id;

  try {
    const assessment = await Assessment.findByPk(assessmentId);
    if (!assessment) {
      return res.status(404).json({ msg: 'Assessment not found' });
    }

    // Simulate grading (in a real app, this would involve running test cases)
    let passed = false;
    let score = 0;
    let feedback = 'Your submission has been received.';

    // Simple grading logic for demonstration
    if (code.includes(assessment.codeTemplate.substring(0, 10))) { // Very basic check
      passed = true;
      score = 100;
      feedback = 'Great job! All tests passed.';
    } else {
      feedback = 'Some tests failed. Please review your code.';
    }

    const submission = await Submission.create({
      code,
      passed,
      score,
      feedback,
      userId,
      assessmentId,
    });

    // If passed and assessment awards a badge, grant the badge to the user
    if (passed && assessment.badgeId) {
      const user = await User.findByPk(userId);
      const badge = await Badge.findByPk(assessment.badgeId);
      if (user && badge) {
        await user.addBadge(badge);
        feedback += ` You have earned the ${badge.name} badge!`;
      }
    }

    res.status(201).json({ submission, feedback });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's badges
router.get('/user/:userId/badges', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: [{ model: Badge, as: 'Badges', attributes: ['id', 'name', 'description', 'iconUrl'] }]
    });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.Badges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;