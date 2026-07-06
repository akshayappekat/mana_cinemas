const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const updatePosters = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Update Pushpa poster
    const pushpa = await Movie.findOneAndUpdate(
      { title: 'Pushpa: The Rise' },
      { posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/pushpa-the-rise-et00129538-08-12-2021-01-21-46.jpg' },
      { new: true }
    );
    console.log('✅ Pushpa poster updated:', pushpa?.posterUrl);

    // Update Salaar poster
    const salaar = await Movie.findOneAndUpdate(
      { title: 'Salaar' },
      { posterUrl: 'https://assets-in.bmscdn.com/iedb/movies/images/mobile/thumbnail/xlarge/salaar-et00310794-1698316265.jpg' },
      { new: true }
    );
    console.log('✅ Salaar poster updated:', salaar?.posterUrl);

    console.log('🎉 Movie posters updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

updatePosters();
