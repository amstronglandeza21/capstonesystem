const express = require('express');
const multer = require('multer');
const Thesis = require('../models/Thesis');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const theses = await Thesis.find().sort({ uploadedAt: -1 });
    res.json(theses);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch theses' });
  }
});

module.exports = router;
