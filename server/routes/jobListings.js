const express = require('express');
const router = express.Router();
const JobListing = require('../models/jobListing');

// Get all job listings
router.get('/', async (req, res) => {
  try {
    const jobListings = await JobListing.findAll();
    res.json(jobListings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new job listing
router.post('/', async (req, res) => {
  const jobListing = new JobListing({
    title: req.body.title,
    description: req.body.description,
    company: req.body.company,
    location: req.body.location,
    skillsRequired: req.body.skillsRequired,
    contactEmail: req.body.contactEmail,
  });
  try {
    const newJobListing = await jobListing.save();
    res.status(201).json(newJobListing);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;