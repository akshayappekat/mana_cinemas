const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const updatePosters = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Using direct, simple HTTPS URLs that work everywhere
    await Movie.findOneAndUpdate(
      { title: 'Pushpa: The Rise' },
      { posterUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Pushpa_-_The_Rise_%282021_film%29.jpg' }
    );
    console.log('✅ Pushpa poster updated');

    await Movie.findOneAndUpdate(
      { title: 'Salaar' },
      { posterUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e6/Salaar_Part_1_%E2%80%93_Ceasefire.jpg' }
    );
    console.log('✅ Salaar poster updated');

    await Movie.findOneAndUpdate(
      { title: 'RRR' },
      { posterUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg' }
    );
    console.log('✅ RRR poster updated');

    console.log('\n🎉 All posters updated with Wikipedia URLs!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

updatePosters();
