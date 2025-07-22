
const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const Snippet = require('../models/snippet');
const User = require('../models/user');
const UserInteraction = require('../models/userInteraction');
const Notification = require('../models/notification');
const { Op } = require('sequelize');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Middleware to protect routes


// Get all snippets
router.get('/', auth, async (req, res) => {
  try {
    const { tag } = req.query;
    let whereClause = {};
    if (tag) {
      whereClause.tags = { [Op.like]: `%${tag}%` };
    }

    let snippets;
    if (req.user && req.user.userId) {
      // Fetch user interactions to build a recommendation profile
      const userInteractions = await UserInteraction.findAll({
        where: { userId: req.user.userId },
        limit: 50, // Limit to recent interactions
        order: [['createdAt', 'DESC']]
      });

      const likedTags = {};
      userInteractions.forEach(interaction => {
        if (interaction.tags) {
          interaction.tags.split(',').forEach(t => {
            const trimmedTag = t.trim();
            if (trimmedTag) {
              likedTags[trimmedTag] = (likedTags[trimmedTag] || 0) + 1;
            }
          });
        }
      });

      const sortedTags = Object.keys(likedTags).sort((a, b) => likedTags[b] - likedTags[a]);
      const topTags = sortedTags.slice(0, 5); // Get top 5 tags

      if (topTags.length > 0) {
        // Fetch snippets based on top tags
        snippets = await Snippet.findAll({
          where: {
            ...whereClause,
            tags: { [Op.or]: topTags.map(t => ({ [Op.like]: `%${t}%` })) }
          },
          include: [{
            model: User,
            attributes: ['id', 'email']
          }],
          order: [['createdAt', 'DESC']],
          limit: 20 // Limit recommended snippets
        });
      }
    }

    // Fallback to general feed if no recommendations or not enough
    if (!snippets || snippets.length === 0) {
      snippets = await Snippet.findAll({
        where: whereClause,
        include: [{
          model: User,
          attributes: ['id', 'email']
        }],
        order: [['createdAt', 'DESC']], // Default order
        limit: 20 // Default limit
      });
    }

    // Record view interaction for each snippet
    if (req.user && req.user.userId) {
      for (const snippet of snippets) {
        await UserInteraction.create({
          userId: req.user.userId,
          snippetId: snippet.id,
          type: 'view',
          tags: snippet.tags // Store tags for recommendation
        });
      }
    }

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

    // Record like interaction
    if (req.user && req.user.userId) {
      await UserInteraction.create({
        userId: req.user.userId,
        snippetId: snippet.id,
        type: 'like',
        tags: snippet.tags // Store tags for recommendation
      });
    }

    res.json(snippet);

    // Create notification for the snippet owner
    if (snippet.userId !== req.user.userId) { // Don't notify if user likes their own snippet
      await Notification.create({
        userId: snippet.userId,
        type: 'like',
        sourceId: snippet.id,
        message: `Your snippet "${snippet.title}" was liked by ${req.user.email}.`,
      });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Fork a snippet
router.post('/:id/fork', auth, async (req, res) => {
  try {
    const originalSnippet = await Snippet.findByPk(req.params.id);
    if (!originalSnippet) {
      return res.status(404).json({ msg: 'Original snippet not found' });
    }

    const forkedSnippet = await Snippet.create({
      title: `Fork of ${originalSnippet.title}`,
      code: originalSnippet.code,
      language: originalSnippet.language,
      tags: originalSnippet.tags,
      userId: req.user.userId,
      forkedFrom: originalSnippet.id
    });

    res.status(201).json(forkedSnippet);

    // Create notification for the original snippet owner
    if (originalSnippet.userId !== req.user.userId) { // Don't notify if user forks their own snippet
      await Notification.create({
        userId: originalSnippet.userId,
        type: 'fork',
        sourceId: originalSnippet.id,
        message: `Your snippet "${originalSnippet.title}" was forked by ${req.user.email}.`,
      });
    }

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
