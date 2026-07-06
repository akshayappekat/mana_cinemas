const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
    },
    seats: {
      type: [String], // e.g., ['A1', 'A2', 'B3']
      required: true,
    },
    seatCategory: {
      type: String,
      enum: ['silver', 'gold', 'platinum'],
      default: 'silver',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'refunded', 'pending'],
      default: 'paid',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet'],
      default: 'card',
    },
    bookingId: {
      type: String,
      unique: true,
    },
    convenienceFee: {
      type: Number,
      default: 30,
    },
  },
  { timestamps: true }
);

// Generate unique booking ID before saving
bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    this.bookingId =
      'MC' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
