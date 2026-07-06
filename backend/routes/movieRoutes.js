const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/movies — get all movies
router.get('/', async (req, res) => {
  try {
    const { genre, language, search, status } = req.query;
    const filter = {};

    if (genre) filter.genre = { $in: [genre] };
    if (language) filter.language = { $in: [language] };
    if (search) filter.title = { $regex: search, $options: 'i' };
    if (status === 'nowShowing') filter.isNowShowing = true;
    if (status === 'upcoming') filter.isUpcoming = true;

    const movies = await Movie.find(filter).sort({ releaseDate: -1 });
    res.json({ success: true, count: movies.length, movies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/movies/:id — get single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, movie });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/movies — admin: create movie
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json({ success: true, movie });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/movies/:id — admin: update movie
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, movie });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/movies/:id — admin: delete movie
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
