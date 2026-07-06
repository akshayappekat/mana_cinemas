const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');

dotenv.config();

const updatePosters = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected\n');

    // Check current posters
    const movies = await Movie.find({});
    console.log('Current movies:');
    movies.forEach(m => {
      console.log(`- ${m.title}: ${m.posterUrl}`);
    });

    console.log('\nUpdating posters...\n');

    // Update with simple, reliable URLs
    await Movie.findOneAndUpdate(
      { title: 'Pushpa: The Rise' },
      { posterUrl: 'https://static.toiimg.com/thumb/msid-88356417,imgsize-56268,width-400,resizemode-4/88356417.jpg' }
    );
    console.log('✅ Pushpa updated');

    await Movie.findOneAndUpdate(
      { title: 'Salaar' },
      { posterUrl: 'https://static.toiimg.com/thumb/msid-105995109,width-400,resizemode-4/105995109.jpg' }
    );
    console.log('✅ Salaar updated');

    console.log('\n🎉 Done! Check updated movies:');
    const updatedMovies = await Movie.find({});
    updatedMovies.forEach(m => {
      console.log(`- ${m.title}: ${m.posterUrl}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

updatePosters();
