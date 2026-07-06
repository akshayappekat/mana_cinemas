const mongoose = require('mongoose');

const screenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  rows: { type: Number, required: true },
  columns: { type: Number, required: true },
  seatLayout: {
    // e.g., { A: ['A1','A2',...], B: [...] }
    type: Map,
    of: [String],
  },
});

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Cinema name is required'],
      trim: true,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: 'Telangana' },
      pincode: { type: String },
    },
    screens: [screenSchema],
    amenities: {
      type: [String],
      default: ['Parking', 'Food Court'],
    },
    contactNumber: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cinema', cinemaSchema);
