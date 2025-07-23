const express = require('express');
const router = express.Router();
const ChallengeSubmission = require('../models/challengeSubmission');

// Get all challenge submissions
router.get('/', async (req, res) => {
  try {
    const submissions = await ChallengeSubmission.findAll();
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new challenge submission
router.post('/', async (req, res) => {
  const submission = new ChallengeSubmission({
    code: req.body.code,
    userId: req.body.userId,
    challengeId: req.body.challengeId,
    isCorrect: req.body.isCorrect,
    feedback: req.body.feedback,
    performanceMetrics: req.body.performanceMetrics,
  });
  try {
    const newSubmission = await submission.save();
    res.status(201).json(newSubmission);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;