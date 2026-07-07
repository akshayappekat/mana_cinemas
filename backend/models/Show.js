const mongoose = require('mongoose');

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cinema',
      required: true,
    },
    screenName: {
      type: String,
      required: true,
    },
    showDate: {
      type: Date,
      required: true,
    },
    showTime: {
      type: String, // e.g., "10:30 AM"
      required: true,
    },
    language: {
      type: String,
      default: 'Telugu',
    },
    format: {
      type: String,
      enum: ['2D', '3D', '4DX', 'IMAX'],
      default: '2D',
    },
    ticketPrice: {
      silver: { type: Number, default: 120 },
      gold: { type: Number, default: 200 },
      platinum: { type: Number, default: 350 },
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
    blockedSeats: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Auto-set availableSeats from totalSeats before first save
showSchema.pre('save', function (next) {
  if (this.isNew && this.availableSeats === undefined) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

module.exports = mongoose.model('Show', showSchema);
