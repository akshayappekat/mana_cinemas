const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const updateAllPosters = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Update RRR poster
    await Movie.findOneAndUpdate(
      { title: 'RRR' },
      { posterUrl: 'https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg' }
    );
    console.log('✅ RRR poster updated');

    // Update Pushpa poster
    await Movie.findOneAndUpdate(
      { title: 'Pushpa: The Rise' },
      { posterUrl: 'https://m.media-amazon.com/images/M/MV5BY2QzYjE0YmMtMDRhMi00ZWJlLWJiMzQtZmYwMWQ0NmJmZWQ1XkEyXkFqcGdeQXVyMTI1NDAzMzM0._V1_.jpg' }
    );
    console.log('✅ Pushpa poster updated');

    // Update Salaar poster
    await Movie.findOneAndUpdate(
      { title: 'Salaar' },
      { posterUrl: 'https://m.media-amazon.com/images/M/MV5BYTRlMDMxN2QtNTI3Ni00MmRiLWFmYWItNzQ2ZGNjOTg4YTZkXkEyXkFqcGdeQXVyMTY1NDY4NTIw._V1_.jpg' }
    );
    console.log('✅ Salaar poster updated');

    console.log('🎉 All movie posters updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error updating posters:', err);
    process.exit(1);
  }
};

updateAllPosters();
