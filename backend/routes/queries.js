const express = require('express');
const router = express.Router();
const Query = require('../models/Query');

// Get unread queries count - MUST be before /:id routes
router.get('/unread', async (req, res) => {
  try {
    const unread_count = await Query.countDocuments({ is_read: false });
    res.json({ unread_count });
  } catch (err) {
    console.error('Unread queries GET error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to fetch unread count' });
  }
});

// Submit a new query
router.post('/', async (req, res) => {
  try {
    const { user_email, user_name, query_subject, query_message } = req.body;
    
    if (!user_email || !query_message) {
      return res.status(400).json({ error: 'Email and message are required' });
    }

    const query = new Query({
      user_email,
      user_name: user_name || null,
      query_subject: query_subject || null,
      query_message,
      is_read: false
    });

    const savedQuery = await query.save();
    console.log('Query submitted:', user_email);
    res.json(savedQuery);
  } catch (err) {
    console.error('Query POST error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to submit query' });
  }
});

// Get all queries (admin only)
router.get('/', async (req, res) => {
  try {
    const queries = await Query.find()
      .sort({ is_read: 1, createdAt: -1 });
    res.json(queries);
  } catch (err) {
    console.error('Queries GET error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to fetch queries' });
  }
});

// Mark query as read
router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Query.findByIdAndUpdate(id, { is_read: true }, { new: true });
    if (!result) return res.status(404).json({ error: 'Query not found' });
    res.json({ success: true, query: result });
  } catch (err) {
    console.error('Query READ error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to mark as read' });
  }
});

// Delete query
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Query.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ error: 'Query not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Query DELETE error:', err.message);
    res.status(500).json({ error: err.message || 'Failed to delete query' });
  }
});

module.exports = router;
