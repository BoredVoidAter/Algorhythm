
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Snippet = require('../models/snippet');
const UserInteraction = require('../models/userInteraction');
const { Op } = require('sequelize');

// Get analytics for creator's snippets
router.get('/snippets', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Total views for all snippets
    const totalViews = await UserInteraction.count({
      where: {
        type: 'view',
        '$Snippet.userId$': userId // Accessing userId from associated Snippet model
      },
      include: [{
        model: Snippet,
        attributes: []
      }]
    });

    // Total likes for all snippets
    const totalLikes = await UserInteraction.count({
      where: {
        type: 'like',
        '$Snippet.userId$': userId
      },
      include: [{
        model: Snippet,
        attributes: []
      }]
    });

    // Snippet-specific analytics
    const snippetsAnalytics = await Snippet.findAll({
      where: { userId },
      attributes: ['id', 'title', 'likesCount'],
      include: [{
        model: UserInteraction,
        attributes: ['type', 'createdAt'],
        required: false // Use left join to include snippets with no interactions
      }]
    });

    const detailedSnippetAnalytics = snippetsAnalytics.map(snippet => {
      const views = snippet.UserInteractions.filter(interaction => interaction.type === 'view').length;
      const likes = snippet.UserInteractions.filter(interaction => interaction.type === 'like').length;
      return {
        id: snippet.id,
        title: snippet.title,
        likesCount: snippet.likesCount,
        views,
        likeToViewRatio: views > 0 ? (likes / views).toFixed(2) : 0
      };
    });

    res.json({
      totalViews,
      totalLikes,
      detailedSnippetAnalytics
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get follower growth trends (simplified - just total followers for now)
router.get('/followers', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const totalFollowers = await UserInteraction.count({
      where: {
        type: 'follow',
        sourceId: userId // Assuming sourceId is the user being followed
      }
    });
    res.json({ totalFollowers });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
