
const express = require('express');
const router = express.Router();
const LiveSession = require('../models/liveSession');
const authenticateToken = require('../middleware/auth');
const Notification = require('../models/notification');
const User = require('../models/user');

// Schedule a new live session
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, scheduledTime, streamUrl } = req.body;
    const liveSession = await LiveSession.create({
      title,
      description,
      scheduledTime,
      streamUrl,
      hostId: req.user.id
    });

    // Notify followers about the new live session
    const followers = await User.findAll({
      include: [{
        model: User,
        as: 'Following',
        where: { id: req.user.id }
      }]
    });

    for (const follower of followers) {
      await Notification.create({
        userId: follower.id,
        type: 'live_session',
        sourceId: liveSession.id,
        message: `${req.user.email} has scheduled a live coding session: "${title}" on ${new Date(scheduledTime).toLocaleString()}.`,
      });
    }

    res.status(201).json(liveSession);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all live sessions (scheduled, live, ended)
router.get('/', async (req, res) => {
  try {
    const liveSessions = await LiveSession.findAll({
      include: [{
        model: User,
        attributes: ['id', 'email']
      }],
      order: [['scheduledTime', 'ASC']]
    });
    res.json(liveSessions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single live session by ID
router.get('/:id', async (req, res) => {
  try {
    const liveSession = await LiveSession.findByPk(req.params.id, {
      include: [{
        model: User,
        attributes: ['id', 'email']
      }]
    });
    if (!liveSession) {
      return res.status(404).json({ msg: 'Live session not found' });
    }
    res.json(liveSession);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update live session status (e.g., to 'live' or 'ended')
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status, recordingUrl, snippetId } = req.body;
    const liveSession = await LiveSession.findByPk(req.params.id);

    if (!liveSession) {
      return res.status(404).json({ msg: 'Live session not found' });
    }

    if (liveSession.hostId !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized to update this session' });
    }

    liveSession.status = status || liveSession.status;
    liveSession.recordingUrl = recordingUrl || liveSession.recordingUrl;
    liveSession.snippetId = snippetId || liveSession.snippetId;

    await liveSession.save();
    res.json(liveSession);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
