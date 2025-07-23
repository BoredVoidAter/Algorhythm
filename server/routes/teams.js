
const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const TeamMember = require('../models/teamMember');
const User = require('../models/user');
const Snippet = require('../models/snippet');
const authenticateToken = require('../middleware/auth');

// Create a new team
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const team = await Team.create({ name, description, ownerId: req.user.id });
    await TeamMember.create({ teamId: team.id, userId: req.user.id, role: 'admin' });
    res.status(201).json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.findAll();
    res.json(teams);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a team by ID
router.get('/:id', async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id, {
      include: [{ model: User, as: 'owner', attributes: ['id', 'email'] }, { model: User, through: TeamMember, as: 'members', attributes: ['id', 'email'] }]
    });
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }
    res.json(team);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Join a team
router.post('/:id/join', authenticateToken, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }
    const existingMember = await TeamMember.findOne({ where: { teamId: team.id, userId: req.user.id } });
    if (existingMember) {
      return res.status(400).json({ msg: 'Already a member of this team' });
    }
    await TeamMember.create({ teamId: team.id, userId: req.user.id, role: 'member' });
    res.json({ msg: 'Joined team successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Leave a team
router.post('/:id/leave', authenticateToken, async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ msg: 'Team not found' });
    }
    // Prevent owner from leaving their own team directly without transferring ownership
    if (team.ownerId === req.user.id) {
      return res.status(400).json({ msg: 'Team owner cannot leave their own team directly. Transfer ownership first.' });
    }
    const deleted = await TeamMember.destroy({ where: { teamId: team.id, userId: req.user.id } });
    if (deleted === 0) {
      return res.status(400).json({ msg: 'Not a member of this team' });
    }
    res.json({ msg: 'Left team successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get snippets by team ID
router.get('/:id/snippets', async (req, res) => {
  try {
    const snippets = await Snippet.findAll({ where: { teamId: req.params.id } });
    res.json(snippets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
