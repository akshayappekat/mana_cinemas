# 🚀 Mana Cinemas - Quick Start (5 Minutes)

## Prerequisites Check
- ✅ Node.js installed (v14+)
- ✅ MongoDB running (local or Atlas)

## Step 1: Backend Setup (2 minutes)

Open terminal in project folder:

```bash
# Navigate to backend
cd mana-cinemas/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and set MONGO_URI (or use default for local MongoDB)
# Default: MONGO_URI=mongodb://localhost:27017/mana-cinemas

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

✅ Backend should now be running on **http://localhost:5000**

## Step 2: Frontend Setup (2 minutes)

Open a **NEW** terminal window:

```bash
# Navigate to frontend
cd mana-cinemas/frontend

# Install dependencies
npm install

# Start frontend
npm start
```

✅ Frontend should now open automatically at **http://localhost:3000**

## Step 3: Test the App (1 minute)

1. **Login with test credentials:**
   - Email: `user@test.com`
   - Password: `user123`

2. **Browse movies** on the home page

3. **Click on a movie** to see details

4. **Select a show** and book tickets

5. **Choose seats** on the interactive seat map

6. **Complete booking** with any payment method

7. **View your booking** in "My Bookings"

## 🎉 That's it! You're ready to go!

---

## Test Credentials

### Regular User
- **Email:** user@test.com
- **Password:** user123

### Admin User (for managing movies/cinemas/shows)
- **Email:** admin@manacinemas.com
- **Password:** admin123

---

## What's Included?

✅ **Sample Data:**
- 3 Movies (RRR, Pushpa, Salaar)
- 2 Cinemas (PVR, INOX) in Hyderabad
- Multiple shows for next 7 days
- Test user accounts

✅ **Features:**
- User authentication
- Movie browsing
- Show selection by date
- Interactive seat booking
- Booking management
- Multiple payment methods
- Responsive design

---

## Need Help?

- **Backend not starting?** Check if MongoDB is running
- **Port already in use?** Change PORT in `.env` file
- **CORS error?** Ensure backend is on port 5000, frontend on 3000
- **Detailed setup:** See `SETUP_GUIDE.md`
- **API docs:** See `API_DOCUMENTATION.md`

---

## Quick Commands

```bash
# Backend
cd mana-cinemas/backend
npm run dev          # Start with auto-reload
npm run seed         # Reset & populate database

# Frontend  
cd mana-cinemas/frontend
npm start           # Development server
```

---

**Ready to book some movies? Let's go! 🎬🍿**
