# Mana Cinemas - Movie Ticket Booking Platform

A full-stack movie ticket booking platform similar to BookMyShow, built with React, Node.js, Express, and MongoDB.

## 🎬 Features

### User Features
- **User Authentication** - Register, login, JWT-based authentication
- **Browse Movies** - View now showing and upcoming movies
- **Movie Details** - Detailed information with cast, genre, ratings
- **Show Selection** - Filter shows by date and cinema
- **Seat Selection** - Interactive seat map with real-time availability
- **Booking Management** - View and cancel bookings
- **Multiple Payment Methods** - Card, UPI, Net Banking, Wallet
- **User Profile** - Manage account information

### Admin Features
- Manage movies (CRUD operations)
- Manage cinemas and screens
- Manage shows and schedules
- View all bookings

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Context API** - State management

## 📁 Project Structure

```
mana-cinemas/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context API
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd mana-cinemas/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mana-cinemas
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd mana-cinemas/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📊 Database Models

### User
- Name, email, password, phone
- Role (user/admin)
- Bookings reference

### Movie
- Title, description, genre, language
- Duration, rating, release date
- Poster, trailer, cast, director
- IMDB rating

### Cinema
- Name, location (address, city, state)
- Screens with seat layout
- Amenities, contact

### Show
- Movie and cinema reference
- Show date and time
- Language and format (2D/3D/4DX/IMAX)
- Ticket prices (silver/gold/platinum)
- Seat availability

### Booking
- User and show reference
- Selected seats, category
- Total amount, payment details
- Booking status, unique booking ID

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Movies
- `GET /api/movies` - Get all movies (filter by genre, language, status)
- `GET /api/movies/:id` - Get single movie
- `POST /api/movies` - Create movie (admin)
- `PUT /api/movies/:id` - Update movie (admin)
- `DELETE /api/movies/:id` - Delete movie (admin)

### Cinemas
- `GET /api/cinemas` - Get all cinemas
- `GET /api/cinemas/:id` - Get single cinema
- `POST /api/cinemas` - Create cinema (admin)
- `PUT /api/cinemas/:id` - Update cinema (admin)

### Shows
- `GET /api/shows` - Get shows (filter by movie, cinema, date)
- `GET /api/shows/:id` - Get single show
- `POST /api/shows` - Create show (admin)
- `PUT /api/shows/:id` - Update show (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user bookings
- `GET /api/bookings/:id` - Get single booking
- `PATCH /api/bookings/:id/cancel` - Cancel booking

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

## 💳 Payment Methods Supported
- Credit/Debit Card
- UPI
- Net Banking
- Wallet

## 🎨 UI Features
- Responsive design
- Interactive seat selection
- Real-time seat availability
- Multi-step booking flow
- Clean and modern interface

## 🔒 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Protected routes
- Admin-only operations
- Input validation

## 🎯 Future Enhancements
- Email notifications
- QR code tickets
- Movie recommendations
- Reviews and ratings
- Offers and coupons
- Multiple languages support
- Admin dashboard
- Analytics

## 📝 Sample Admin Credentials
Create an admin user by directly setting `role: 'admin'` in MongoDB or through registration endpoint.

## 🤝 Contributing
Feel free to submit issues and enhancement requests!

## 📄 License
This project is for educational purposes.

## 👨‍💻 Author
Built with ❤️ for movie lovers!
