
const express = require('express');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');
const Snippet = require('../models/snippet');
const User = require('../models/user');
const UserInteraction = require('../models/userInteraction');
const Notification = require('../models/notification');
const { Op } = require('sequelize');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Middleware to protect routes


// Get all snippets
router.get('/', authenticateToken, async (req, res) => {
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
router.post('/', authenticateToken, async (req, res) => {
  const { title, code, language, tags, teamId, coAuthors } = req.body;
  try {
    let snippetUserId = req.user.userId;
    if (teamId) {
      const team = await Team.findByPk(teamId);
      if (!team) {
        return res.status(404).json({ msg: 'Team not found' });
      }
      const isTeamMember = await TeamMember.findOne({ where: { teamId, userId: req.user.userId } });
      if (!isTeamMember) {
        return res.status(403).json({ msg: 'You are not a member of this team' });
      }
      // If a teamId is provided, the snippet is associated with the team, not a single user directly
      // The userId on the snippet will still be the creator, but the teamId indicates it's a team snippet
    }

    const snippet = await Snippet.create({ title, code, language, tags, userId: snippetUserId, teamId, coAuthors });
    res.status(201).json(snippet);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Like a snippet
router.post('/:id/like', authenticateToken, async (req, res) => {
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
router.post('/:id/fork', authenticateToken, async (req, res) => {
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

// AI-powered code assistant feedback
router.post('/ai-feedback', authenticateToken, async (req, res) => {
  const { code, language } = req.body;
  // In a real application, this would call an external AI service
  // For now, we'll return a mock response
  let feedback = "Looks good! Consider adding more comments for complex parts.";
  if (language === 'javascript' && code.includes('var ')) {
    feedback += " Also, 'var' is outdated in modern JavaScript; consider using 'let' or 'const'.";
  } else if (language === 'python' && code.includes(';')) {
    feedback += " Python doesn't typically use semicolons at the end of lines.";
  } else if (code.length < 20) {
    feedback += " The code seems a bit short. Is it complete?";
  }

  res.json({ feedback });
});

// Semantic search for snippets
router.post('/search-semantic', authenticateToken, async (req, res) => {
  const { query } = req.body;
  try {
    const snippets = await Snippet.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { code: { [Op.like]: `%${query}%` } },
          { tags: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [{
        model: User,
        attributes: ['id', 'email']
      }],
      order: [['createdAt', 'DESC']],
    });
    res.json(snippets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
