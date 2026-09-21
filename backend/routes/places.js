const express = require('express');
const router = express.Router();
const Place = require('../models/Place');

// Get all places
router.get('/', async (req, res) => {
  try {
    const places = await Place.find().sort({ name: 1 });
    // Transform to use 'id' instead of '_id' for consistency
    const transformedPlaces = places.map(p => ({
      id: p._id,
      _id: p._id,
      name: p.name,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));
    res.json(transformedPlaces);
  } catch (err) {
    console.error('Places GET error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to fetch places' });
  }
});

// Add a place
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    console.log('Adding place:', name);
    if (!name) return res.status(400).json({ error: 'Place name required' });
    
    const place = new Place({ name });
    const savedPlace = await place.save();
    console.log('Place inserted with ID:', savedPlace._id);
    res.json(savedPlace);
  } catch (err) {
    console.error('Places POST error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to add place' });
  }
});

// Delete place
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Place.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Places DELETE error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to delete place' });
  }
});

module.exports = router;
