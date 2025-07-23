const express = require('express');
const router = express.Router();
const Message = require('../models/message');
const auth = require('../middleware/auth');
const { Op } = require('sequelize');

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      content
    });
    res.status(201).send(message);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get messages for a user (inbox/sent)
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      order: [['createdAt', 'DESC']]
    });
    res.send(messages);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

// Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findByPk(req.params.id);
    if (!message) {
      return res.status(404).send({ error: 'Message not found' });
    }
    if (message.receiverId !== req.user.id) {
      return res.status(403).send({ error: 'Unauthorized' });
    }
    message.read = true;
    await message.save();
    res.send(message);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
});

module.exports = router;
