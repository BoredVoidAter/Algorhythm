const express = require('express');
const authenticateToken = require('../middleware/auth');
const Challenge = require('../models/challenge');
const Snippet = require('../models/snippet');
const User = require('../models/user');
const { Op } = require('sequelize');

const router = express.Router();

// Create a new challenge (Admin only, or specific role)
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, startDate, endDate, tag } = req.body;
  // TODO: Add role-based authorization here if needed
  try {
    const challenge = await Challenge.create({ title, description, startDate, endDate, tag });
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all challenges
router.get('/', async (req, res) => {
  try {
    const challenges = await Challenge.findAll();
    res.json(challenges);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ msg: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get snippets for a specific challenge
router.get('/:id/snippets', async (req, res) => {
  try {
    const challenge = await Challenge.findByPk(req.params.id);
    if (!challenge) {
      return res.status(404).json({ msg: 'Challenge not found' });
    }

    const snippets = await Snippet.findAll({
      where: { tags: { [Op.like]: `%${challenge.tag}%` } },
      include: [{
        model: User,
        attributes: ['id', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(snippets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
