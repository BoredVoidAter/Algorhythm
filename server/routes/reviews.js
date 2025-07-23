
const express = require('express');
const router = express.Router();
const { Review, ReviewComment, Snippet, User } = require('../models');
const authenticateToken = require('../middleware/auth');

// Request a code review for a snippet
router.post('/request', authenticateToken, async (req, res) => {
  try {
    const { snippetId } = req.body;
    const userId = req.user.id; // User requesting the review

    const snippet = await Snippet.findByPk(snippetId);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    if (snippet.userId !== userId) {
      return res.status(403).json({ message: 'You can only request reviews for your own snippets' });
    }

    // Check if a review already exists for this snippet
    const existingReview = await Review.findOne({ where: { snippetId } });
    if (existingReview) {
      return res.status(409).json({ message: 'A review request for this snippet already exists' });
    }

    const review = await Review.create({
      snippetId,
      creatorId: userId,
      status: 'Review Requested'
    });

    // Update snippet status
    await snippet.update({ reviewStatus: 'Review Requested' });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reviews (for a reviewer or creator)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.findAll({
      where: { creatorId: userId }, // Or reviewerId: userId if assigned
      include: [{ model: Snippet }, { model: User, as: 'Reviewer' }, { model: User, as: 'Creator' }]
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific review by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id, {
      include: [
        { model: Snippet },
        { model: User, as: 'Reviewer' },
        { model: User, as: 'Creator' },
        { model: ReviewComment, include: [{ model: User }] }
      ]
    });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a comment to a review
router.post('/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, lineNumber } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const reviewComment = await ReviewComment.create({
      reviewId: id,
      userId,
      comment,
      lineNumber
    });
    res.status(201).json(reviewComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update review status (e.g., Changes Needed, Approved)
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Only the creator or assigned reviewer can change status
    if (review.creatorId !== userId && review.reviewerId !== userId) {
      return res.status(403).json({ message: 'You are not authorized to update this review' });
    }

    await review.update({ status });

    // Update snippet status as well
    await Snippet.update({ reviewStatus: status }, { where: { id: review.snippetId } });

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
