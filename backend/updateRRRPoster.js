const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const updateRRRPoster = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Update RRR movie with online poster URL
    const result = await Movie.findOneAndUpdate(
      { title: 'RRR' },
      { 
        posterUrl: 'https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg'
      },
      { new: true }
    );

    if (result) {
      console.log('✅ RRR poster updated successfully!');
      console.log('Movie:', result.title);
      console.log('Poster URL:', result.posterUrl);
    } else {
      console.log('❌ RRR movie not found');
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating poster:', err);
    process.exit(1);
  }
};

updateRRRPoster();
