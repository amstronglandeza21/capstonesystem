const express = require('express');
const Thesis = require('../models/Thesis');
const router = express.Router();

// GET all theses
router.get('/', async (req, res) => {
  try {
    const theses = await Thesis.find().sort({ uploadedAt: -1 });
    res.json(theses);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch theses' });
  }
});

// DELETE selected theses
router.delete('/delete', async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'No thesis IDs provided' });
  }

  try {
    await Thesis.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Theses deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete theses' });
  }
});

module.exports = router;
