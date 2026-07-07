const express = require('express');
const router = express.Router();
const Show = require('../models/Show');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/shows — optionally filter by movie, cinema, date
router.get('/', async (req, res) => {
  try {
    const { movieId, cinemaId, date } = req.query;
    const filter = { isActive: true };

    if (movieId) filter.movie = movieId;
    if (cinemaId) filter.cinema = cinemaId;
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      filter.showDate = { $gte: startOfDay, $lte: endOfDay };
    }

    const shows = await Show.find(filter)
      .populate('movie', 'title posterUrl duration genre rating')
      .populate('cinema', 'name location')
      .sort({ showDate: 1, showTime: 1 });

    res.json({ success: true, count: shows.length, shows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/shows/:id — get single show with seat info
router.get('/:id', async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('cinema');
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });
    res.json({ success: true, show });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/shows — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.status(201).json({ success: true, show });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/shows/:id — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });
    res.json({ success: true, show });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/shows/:id/block-seats — admin only: block or unblock seats
router.patch('/:id/block-seats', protect, adminOnly, async (req, res) => {
  try {
    const { seats, action } = req.body; // action: 'block' | 'unblock'
    const show = await Show.findById(req.params.id);
    if (!show) return res.status(404).json({ success: false, message: 'Show not found' });

    if (action === 'block') {
      // Add seats to blockedSeats (avoid duplicates, skip already booked)
      const alreadyBooked = seats.filter(s => show.bookedSeats.includes(s));
      if (alreadyBooked.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Seats already booked by users: ${alreadyBooked.join(', ')}`,
        });
      }
      show.blockedSeats = [...new Set([...show.blockedSeats, ...seats])];
    } else if (action === 'unblock') {
      show.blockedSeats = show.blockedSeats.filter(s => !seats.includes(s));
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action. Use block or unblock' });
    }

    await show.save();
    res.json({ success: true, blockedSeats: show.blockedSeats, message: `Seats ${action}ed successfully` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/shows/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Show deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
