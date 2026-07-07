const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Show = require('../models/Show');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// POST /api/bookings — create a booking
router.post('/', protect, async (req, res) => {
  try {
    const { showId, seats, seatCategory, paymentMethod } = req.body;

    // Validate seat count (min 1, max 5)
    if (!seats || seats.length === 0) {
      return res.status(400).json({ success: false, message: 'Please select at least 1 seat' });
    }
    if (seats.length > 5) {
      return res.status(400).json({ success: false, message: 'You can book a maximum of 5 seats per booking' });
    }

    // Validate show
    const show = await Show.findById(showId).populate('movie cinema');
    if (!show || !show.isActive) {
      return res.status(404).json({ success: false, message: 'Show not found or inactive' });
    }

    // Check if any seat is already booked
    const conflictSeats = seats.filter((seat) => show.bookedSeats.includes(seat));
    if (conflictSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats already booked: ${conflictSeats.join(', ')}`,
      });
    }

    // Calculate total
    const pricePerSeat = show.ticketPrice[seatCategory] || show.ticketPrice.silver;
    const convenienceFee = 30;
    const totalAmount = pricePerSeat * seats.length + convenienceFee;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      show: showId,
      seats,
      seatCategory,
      totalAmount,
      paymentMethod: paymentMethod || 'card',
      convenienceFee,
    });

    // Update show - mark seats as booked
    show.bookedSeats.push(...seats);
    show.availableSeats = show.totalSeats - show.bookedSeats.length;
    await show.save();

    // Update user bookings
    await User.findByIdAndUpdate(req.user._id, { $push: { bookings: booking._id } });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('show', 'showDate showTime language format ticketPrice')
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title posterUrl duration' },
          { path: 'cinema', select: 'name location' },
        ],
      });

    res.status(201).json({ success: true, booking: populatedBooking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/my — get current user's bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title posterUrl duration genre' },
          { path: 'cinema', select: 'name location' },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings/:id — get single booking
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'show',
      populate: [
        { path: 'movie', select: 'title posterUrl duration genre rating' },
        { path: 'cinema', select: 'name location' },
      ],
    });

    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Only owner or admin can view
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/bookings/:id/cancel — cancel a booking
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Release the seats back
    const show = await Show.findById(booking.show);
    if (show) {
      show.bookedSeats = show.bookedSeats.filter((seat) => !booking.seats.includes(seat));
      show.availableSeats = show.totalSeats - show.bookedSeats.length;
      await show.save();
    }

    res.json({ success: true, message: 'Booking cancelled and refund initiated', booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/bookings — admin: get all bookings
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate({
        path: 'show',
        populate: [
          { path: 'movie', select: 'title' },
          { path: 'cinema', select: 'name' },
        ],
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
