const express = require('express');
const router = express.Router();
const Collection = require('../models/collection');
const Snippet = require('../models/snippet');
const CollectionSnippet = require('../models/collectionSnippet');
const auth = require('../middleware/auth');

// Create a new collection
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    const newCollection = await Collection.create({
      name,
      description,
      isPublic,
      userId: req.user.id,
    });
    res.status(201).json(newCollection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all collections for a user
router.get('/my', auth, async (req, res) => {
  try {
    const collections = await Collection.findAll({
      where: { userId: req.user.id },
      include: [{ model: Snippet, through: { attributes: [] } }],
    });
    res.json(collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a specific collection by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id, {
      include: [{ model: Snippet, through: { attributes: [] } }],
    });
    if (!collection) {
      return res.status(404).json({ msg: 'Collection not found' });
    }
    if (!collection.isPublic && (!req.user || collection.userId !== req.user.id)) {
      return res.status(403).json({ msg: 'Not authorized to view this collection' });
    }
    res.json(collection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all public collections
router.get('/public', async (req, res) => {
  try {
    const publicCollections = await Collection.findAll({
      where: { isPublic: true },
      include: [{ model: Snippet, through: { attributes: [] } }],
    });
    res.json(publicCollections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a collection
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    let collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ msg: 'Collection not found' });
    }

    if (collection.userId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    collection.name = name || collection.name;
    collection.description = description || collection.description;
    collection.isPublic = isPublic !== undefined ? isPublic : collection.isPublic;

    await collection.save();
    res.json(collection);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a collection
router.delete('/:id', auth, async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);

    if (!collection) {
      return res.status(404).json({ msg: 'Collection not found' });
    }

    if (collection.userId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await collection.destroy();
    res.json({ msg: 'Collection removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Add a snippet to a collection
router.post('/:collectionId/snippets/:snippetId', auth, async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.collectionId);
    const snippet = await Snippet.findByPk(req.params.snippetId);

    if (!collection || !snippet) {
      return res.status(404).json({ msg: 'Collection or Snippet not found' });
    }

    if (collection.userId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to modify this collection' });
    }

    await collection.addSnippet(snippet);
    res.json({ msg: 'Snippet added to collection' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Remove a snippet from a collection
router.delete('/:collectionId/snippets/:snippetId', auth, async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.collectionId);
    const snippet = await Snippet.findByPk(req.params.snippetId);

    if (!collection || !snippet) {
      return res.status(404).json({ msg: 'Collection or Snippet not found' });
    }

    if (collection.userId !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to modify this collection' });
    }

    await collection.removeSnippet(snippet);
    res.json({ msg: 'Snippet removed from collection' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
