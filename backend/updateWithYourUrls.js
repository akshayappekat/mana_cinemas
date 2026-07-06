const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const updatePosters = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Update Pushpa poster
    const pushpa = await Movie.findOneAndUpdate(
      { title: 'Pushpa: The Rise' },
      { posterUrl: 'https://media-cache.cinematerial.com/p/500x/l0xympxu/pushpa-the-rule-part-2-indian-movie-poster.jpg' },
      { new: true }
    );
    console.log('✅ Pushpa poster updated');
    console.log('   URL:', pushpa.posterUrl);

    // Update Salaar poster
    const salaar = await Movie.findOneAndUpdate(
      { title: 'Salaar' },
      { posterUrl: 'https://media-cache.cinematerial.com/p/500x/fj9vgsbh/salaar-indian-movie-poster.jpg' },
      { new: true }
    );
    console.log('✅ Salaar poster updated');
    console.log('   URL:', salaar.posterUrl);

    console.log('\n🎉 Both posters updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

updatePosters();
