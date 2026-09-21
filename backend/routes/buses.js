const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');
const Place = require('../models/Place');

// Timetable for place id - MUST be before /:id routes to avoid conflicts
router.get('/timetable/:placeId', async (req, res) => {
  try {
    let placeId = req.params.placeId;
    let place;
    
    // Try to find by ObjectId first, then by name
    try {
      place = await Place.findById(placeId);
    } catch (err) {
      // If not a valid ObjectId, try by name
      place = await Place.findOne({ name: placeId });
    }
    
    if (!place) return res.status(404).json({ error: 'Place not found' });

    const buses = await Bus.find({
      $or: [
        { from_place_id: place._id },
        { to_place_id: place._id }
      ]
    })
    .populate('from_place_id', 'name')
    .populate('to_place_id', 'name')
    .sort({ departure_time: 1 });
    
    const transformedBuses = buses.map(bus => ({
      busid: bus._id,
      class_of_service: bus.class_of_service,
      via_places: bus.via_places,
      departure_time: bus.departure_time,
      from_name: bus.from_place_id.name,
      to_name: bus.to_place_id.name,
    }));
    
    res.json(transformedBuses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all buses (optionally filter by from/to)
router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query;
    let filter = {};
    
    if (from || to) {
      if (from) {
        const fromPlace = await Place.findOne({ name: from });
        if (fromPlace) filter.from_place_id = fromPlace._id;
      }
      if (to) {
        const toPlace = await Place.findOne({ name: to });
        if (toPlace) filter.to_place_id = toPlace._id;
      }
    }
    
    const buses = await Bus.find(filter)
      .populate('from_place_id', 'name')
      .populate('to_place_id', 'name')
      .sort({ departure_time: 1 });
    
    // Transform response to match original format
    const transformedBuses = buses.map(bus => ({
      busid: bus._id,
      class_of_service: bus.class_of_service,
      via_places: bus.via_places,
      departure_time: bus.departure_time,
      from_id: bus.from_place_id._id,
      from_name: bus.from_place_id.name,
      to_id: bus.to_place_id._id,
      to_name: bus.to_place_id.name,
    }));
    
    res.json(transformedBuses);
  } catch (err) {
    console.error('Buses GET error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to fetch buses' });
  }
});

// Add bus
router.post('/', async (req, res) => {
  try {
    const { from_place_id, to_place_id, class_of_service, via_places, departure_time } = req.body;
    if (!from_place_id || !to_place_id) return res.status(400).json({ error: 'from and to required' });
    
    const bus = new Bus({
      from_place_id,
      to_place_id,
      class_of_service: class_of_service || '',
      via_places: via_places || '',
      departure_time: departure_time || null,
    });
    
    const savedBus = await bus.save();
    const populatedBus = await Bus.findById(savedBus._id)
      .populate('from_place_id', 'name')
      .populate('to_place_id', 'name');
    
    res.json({
      busid: populatedBus._id,
      class_of_service: populatedBus.class_of_service,
      via_places: populatedBus.via_places,
      departure_time: populatedBus.departure_time,
      from_id: populatedBus.from_place_id._id,
      from_name: populatedBus.from_place_id.name,
      to_id: populatedBus.to_place_id._id,
      to_name: populatedBus.to_place_id.name,
    });
  } catch (err) {
    console.error('Buses POST error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to add bus' });
  }
});

// Delete bus
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Bus.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error('Buses DELETE error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to delete bus' });
  }
});

module.exports = router;
