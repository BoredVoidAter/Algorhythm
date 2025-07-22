
const express = require('express');
const jwt = require('jsonwebtoken');
const Snippet = require('../models/snippet');
const User = require('../models/user');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401); // No token provided
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Invalid token
    }
    req.user = user;
    next();
  });
};

// Get all snippets
router.get('/', async (req, res) => {
  try {
    const snippets = await Snippet.findAll({
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
router.post('/', authenticateToken, async (req, res) => {
  const { title, code, language } = req.body;
  try {
    const snippet = await Snippet.create({ title, code, language, userId: req.user.userId });
    res.status(201).json(snippet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
