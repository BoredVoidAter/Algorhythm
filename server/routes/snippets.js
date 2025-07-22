
const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Snippet = require('../models/snippet');
const User = require('../models/user');
const { Op } = require('sequelize');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Middleware to protect routes


// Get all snippets
router.get('/', async (req, res) => {
  try {
    const { tag } = req.query;
    let whereClause = {};
    if (tag) {
      whereClause.tags = { [Op.like]: `%${tag}%` };
    }

    const snippets = await Snippet.findAll({
      where: whereClause,
      include: [{
        model: User,
        attributes: ['id', 'email'] // Only include necessary user info
      }]
    });
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new snippet
router.post('/', auth, async (req, res) => {
  const { title, code, language, tags } = req.body;
  try {
    const snippet = await Snippet.create({ title, code, language, tags, userId: req.user.userId });
    res.status(201).json(snippet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like a snippet
router.post('/:id/like', auth, async (req, res) => {
  try {
    const snippet = await Snippet.findByPk(req.params.id);
    if (!snippet) {
      return res.status(404).json({ msg: 'Snippet not found' });
    }
    snippet.likesCount += 1;
    await snippet.save();
    res.json(snippet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
