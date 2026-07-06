# Mana Cinemas - Complete Setup Guide

## Step-by-Step Installation

### Step 1: Install MongoDB

#### Option A: MongoDB Local Installation
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Default connection: `mongodb://localhost:27017`

#### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account and cluster
3. Get connection string like: `mongodb+srv://username:password@cluster.mongodb.net/mana-cinemas`

### Step 2: Backend Setup

1. Open terminal in project root:
```bash
cd mana-cinemas/backend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Edit `.env` file and update:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mana-cinemas
JWT_SECRET=mana_cinemas_secret_2024_xyz
JWT_EXPIRE=7d
```

5. Seed database with sample data:
```bash
npm run seed
```

6. Start backend server:
```bash
npm run dev
```

✅ Backend running at: http://localhost:5000

### Step 3: Frontend Setup

1. Open NEW terminal window and navigate to frontend:
```bash
cd mana-cinemas/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start frontend:
```bash
npm start
```

✅ Frontend running at: http://localhost:3000

## Test Credentials

After running `npm run seed`, use these credentials:

### Admin Login
- **Email:** admin@manacinemas.com
- **Password:** admin123

### Regular User Login
- **Email:** user@test.com
- **Password:** user123

## Quick Test Flow

1. Visit http://localhost:3000
2. Click "Login" and use test credentials
3. Browse movies on home page
4. Click on a movie to see details
5. Select date and cinema
6. Choose show time
7. Select seats on interactive map
8. Choose payment method
9. Complete booking
10. View "My Bookings" to see confirmed ticket

## API Testing with Postman/Thunder Client

### 1. Register New User
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91-9876543210"
}
```

### 2. Login
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Copy the `token` from response.

### 3. Get Movies
```http
GET http://localhost:5000/api/movies?status=nowShowing
```

### 4. Get Shows for a Movie
```http
GET http://localhost:5000/api/shows?movieId=<movie_id>&date=2026-07-06
```

### 5. Create Booking (Protected)
```http
POST http://localhost:5000/api/bookings
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "showId": "<show_id>",
  "seats": ["A1", "A2", "A3"],
  "seatCategory": "gold",
  "paymentMethod": "upi"
}
```

### 6. Get My Bookings (Protected)
```http
GET http://localhost:5000/api/bookings/my
Authorization: Bearer <your_token>
```

## Common Issues & Solutions

### Issue 1: MongoDB Connection Error
**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running
- Check `MONGO_URI` in `.env` file
- For local: `mongodb://localhost:27017/mana-cinemas`
- For Atlas: Use connection string from MongoDB Atlas

### Issue 2: Port Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
- Change `PORT` in `.env` to different number (e.g., 5001)
- Or kill process using port: `npx kill-port 5000`

### Issue 3: CORS Error in Browser
**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:**
- Ensure backend is running on port 5000
- Check CORS configuration in `server.js`
- Frontend must run on port 3000 (configured in CORS)

### Issue 4: JWT Token Invalid
**Error:** `Invalid token` or `Token expired`

**Solution:**
- Login again to get fresh token
- Ensure `JWT_SECRET` matches in `.env`
- Token expires after 7 days by default

### Issue 5: npm install fails
**Error:** Various npm errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Project Structure Explained

```
mana-cinemas/
│
├── backend/                    # Node.js + Express API
│   ├── models/                # MongoDB schemas (User, Movie, etc.)
│   ├── routes/                # API endpoints
│   ├── middleware/            # Authentication middleware
│   ├── server.js              # Express server
│   ├── seedData.js            # Sample data script
│   └── .env                   # Environment variables
│
├── frontend/                  # React application
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── context/           # Auth context
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   └── tailwind.config.js     # Tailwind CSS config
│
└── README.md                  # Documentation
```

## Database Collections

After seeding, you'll have:

- **users** - User accounts (admin + test user)
- **movies** - Movie catalog (3 sample movies)
- **cinemas** - Cinema locations (2 cinemas with screens)
- **shows** - Show timings (multiple shows for 7 days)
- **bookings** - User bookings (empty initially)

## Next Steps

### For Development:
1. Add more movies through admin panel
2. Create new cinemas in different cities
3. Schedule shows for your movies
4. Test the complete booking flow

### For Customization:
1. Update colors in `frontend/tailwind.config.js`
2. Modify seat layout in `ShowBooking.js`
3. Add more payment gateways
4. Implement email notifications
5. Add movie search and filters

### For Production:
1. Use environment variables for sensitive data
2. Enable HTTPS
3. Add rate limiting
4. Implement proper error logging
5. Use production MongoDB (Atlas)
6. Build frontend: `npm run build`
7. Deploy backend and frontend separately

## Useful Commands

```bash
# Backend
npm run dev          # Start with auto-reload
npm start           # Production start
npm run seed        # Populate sample data

# Frontend
npm start           # Development server
npm run build       # Create production build
npm test            # Run tests

# MongoDB
mongosh             # Open MongoDB shell
show dbs            # List databases
use mana-cinemas    # Switch to database
db.movies.find()    # View all movies
```

## Support

For issues or questions:
1. Check this guide first
2. Review error messages carefully
3. Check browser console for frontend errors
4. Check terminal for backend errors
5. Verify MongoDB connection

Happy Coding! 🎬🍿
