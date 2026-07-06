const express = require('express');
const router = express.Router();
const Cinema = require('../models/Cinema');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/cinemas
router.get('/', async (req, res) => {
  try {
    const { city } = req.query;
    const filter = { isActive: true };
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };

    const cinemas = await Cinema.find(filter);
    res.json({ success: true, count: cinemas.length, cinemas });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/cinemas/:id
router.get('/:id', async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) return res.status(404).json({ success: false, message: 'Cinema not found' });
    res.json({ success: true, cinema });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/cinemas — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const cinema = await Cinema.create(req.body);
    res.status(201).json({ success: true, cinema });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/cinemas/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const cinema = await Cinema.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!cinema) return res.status(404).json({ success: false, message: 'Cinema not found' });
    res.json({ success: true, cinema });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/cinemas/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Cinema.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Cinema deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
