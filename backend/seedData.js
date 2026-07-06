const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Movie = require('./models/Movie');
const Cinema = require('./models/Cinema');
const Show = require('./models/Show');
const User = require('./models/User');

dotenv.config();

const sampleMovies = [
  {
    title: 'RRR',
    description: 'A fictional story about two Indian revolutionaries, Alluri Sitarama Raju and Komaram Bheem, who fought against the British Raj and Nizam of Hyderabad.',
    genre: ['Action', 'Drama', 'Historical'],
    language: ['Telugu', 'Hindi', 'Tamil'],
    duration: 187,
    releaseDate: new Date('2022-03-25'),
    rating: 'UA',
    posterUrl: 'https://example.com/rrr-poster.jpg',
    director: 'S.S. Rajamouli',
    cast: [
      { name: 'Ram Charan', role: 'Alluri Sitarama Raju' },
      { name: 'Jr NTR', role: 'Komaram Bheem' },
    ],
    imdbRating: 7.9,
    isNowShowing: true,
    isUpcoming: false,
  },
  {
    title: 'Pushpa: The Rise',
    description: 'Violence erupts between red sandalwood smugglers and the police charged with bringing down their organization.',
    genre: ['Action', 'Crime', 'Thriller'],
    language: ['Telugu', 'Hindi', 'Tamil', 'Malayalam'],
    duration: 179,
    releaseDate: new Date('2021-12-17'),
    rating: 'UA',
    posterUrl: 'https://example.com/pushpa-poster.jpg',
    director: 'Sukumar',
    cast: [
      { name: 'Allu Arjun', role: 'Pushpa Raj' },
      { name: 'Rashmika Mandanna', role: 'Srivalli' },
    ],
    imdbRating: 7.6,
    isNowShowing: true,
    isUpcoming: false,
  },
  {
    title: 'Salaar',
    description: 'A gang leader tries to keep a promise made to his dying friend and takes on the other criminal gangs.',
    genre: ['Action', 'Thriller'],
    language: ['Telugu', 'Hindi', 'Tamil', 'Kannada'],
    duration: 175,
    releaseDate: new Date('2027-12-22'),
    rating: 'A',
    posterUrl: 'https://example.com/salaar-poster.jpg',
    director: 'Prashanth Neel',
    cast: [
      { name: 'Prabhas', role: 'Salaar' },
      { name: 'Prithviraj Sukumaran', role: 'Vardha' },
    ],
    imdbRating: 7.3,
    isNowShowing: false,
    isUpcoming: true,
  },
];

const sampleCinemas = [
  {
    name: 'PVR Cinemas',
    location: {
      address: 'Forum Sujana Mall, Kukatpally',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500072',
    },
    screens: [
      {
        name: 'Screen 1',
        totalSeats: 80,
        rows: 8,
        columns: 10,
      },
      {
        name: 'Screen 2',
        totalSeats: 80,
        rows: 8,
        columns: 10,
      },
    ],
    amenities: ['Parking', 'Food Court', 'Wheelchair Accessible', 'Recliner Seats'],
    contactNumber: '+91-40-12345678',
    isActive: true,
  },
  {
    name: 'INOX Multiplex',
    location: {
      address: 'GVK One Mall, Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500034',
    },
    screens: [
      {
        name: 'Audi 1',
        totalSeats: 80,
        rows: 8,
        columns: 10,
      },
      {
        name: 'Audi 2',
        totalSeats: 80,
        rows: 8,
        columns: 10,
      },
    ],
    amenities: ['Parking', 'Food Court', '4DX', 'Dolby Atmos'],
    contactNumber: '+91-40-87654321',
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    await Movie.deleteMany({});
    await Cinema.deleteMany({});
    await Show.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert movies
    const movies = await Movie.insertMany(sampleMovies);
    console.log(`✅ ${movies.length} movies created`);

    // Insert cinemas
    const cinemas = await Cinema.insertMany(sampleCinemas);
    console.log(`✅ ${cinemas.length} cinemas created`);

    // Create shows for the next 7 days
    const showTimes = ['10:00 AM', '01:30 PM', '05:00 PM', '08:30 PM', '11:00 PM'];
    const formats = ['2D', '3D', 'IMAX'];
    const shows = [];

    for (let i = 0; i < 7; i++) {
      const showDate = new Date();
      showDate.setDate(showDate.getDate() + i);

      movies.forEach((movie) => {
        if (movie.isNowShowing) {
          cinemas.forEach((cinema) => {
            cinema.screens.forEach((screen) => {
              showTimes.slice(0, 3).forEach((time) => {
                shows.push({
                  movie: movie._id,
                  cinema: cinema._id,
                  screenName: screen.name,
                  showDate,
                  showTime: time,
                  language: movie.language[0],
                  format: formats[Math.floor(Math.random() * formats.length)],
                  ticketPrice: {
                    silver: 120 + Math.floor(Math.random() * 50),
                    gold: 200 + Math.floor(Math.random() * 50),
                    platinum: 350 + Math.floor(Math.random() * 100),
                  },
                  totalSeats: screen.totalSeats,
                  availableSeats: screen.totalSeats,
                  bookedSeats: [],
                  isActive: true,
                });
              });
            });
          });
        }
      });
    }

    await Show.insertMany(shows);
    console.log(`✅ ${shows.length} shows created`);

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@manacinemas.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@manacinemas.com',
        password: 'admin123',
        role: 'admin',
        phone: '+91-9999999999',
      });
      console.log('✅ Admin user created (email: admin@manacinemas.com, password: admin123)');
    }

    // Create test user
    const userExists = await User.findOne({ email: 'user@test.com' });
    if (!userExists) {
      await User.create({
        name: 'Test User',
        email: 'user@test.com',
        password: 'user123',
        phone: '+91-8888888888',
      });
      console.log('✅ Test user created (email: user@test.com, password: user123)');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
