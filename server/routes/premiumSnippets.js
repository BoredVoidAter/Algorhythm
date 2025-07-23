const express = require('express');
const router = express.Router();
const PremiumSnippet = require('../models/premiumSnippet');

// Get all premium snippets
router.get('/', async (req, res) => {
  try {
    const premiumSnippets = await PremiumSnippet.findAll();
    res.json(premiumSnippets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new premium snippet
router.post('/', async (req, res) => {
  const premiumSnippet = new PremiumSnippet({
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    price: req.body.price,
    licensingModel: req.body.licensingModel,
    userId: req.body.userId,
  });
  try {
    const newPremiumSnippet = await premiumSnippet.save();
    res.status(201).json(newPremiumSnippet);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;