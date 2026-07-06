const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    genre: {
      type: [String],
      required: [true, 'Genre is required'],
    },
    language: {
      type: [String],
      default: ['Telugu'],
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration is required'],
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required'],
    },
    rating: {
      type: String,
      enum: ['U', 'UA', 'A', 'S'],
      default: 'UA',
    },
    posterUrl: {
      type: String,
      default: '',
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    cast: [
      {
        name: String,
        role: String,
      },
    ],
    director: {
      type: String,
      default: '',
    },
    imdbRating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    isNowShowing: {
      type: Boolean,
      default: true,
    },
    isUpcoming: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
