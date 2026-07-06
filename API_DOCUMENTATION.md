# Mana Cinemas - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

Most endpoints require JWT authentication. Include token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
Creates a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91-9876543210"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "phone": "+91-9876543210"
  }
}
```

### Login User
Authenticates user and returns JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

### Get Current User
Returns authenticated user's information.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

## 🎬 Movie Endpoints

### Get All Movies
Retrieves list of movies with optional filters.

**Endpoint:** `GET /movies`

**Query Parameters:**
- `genre` - Filter by genre (e.g., Action, Drama)
- `language` - Filter by language (e.g., Telugu, Hindi)
- `search` - Search by title
- `status` - Filter by status: `nowShowing` or `upcoming`

**Examples:**
```
GET /movies
GET /movies?status=nowShowing
GET /movies?genre=Action&language=Telugu
GET /movies?search=RRR
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "movies": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "title": "RRR",
      "description": "A fictional story about two Indian revolutionaries...",
      "genre": ["Action", "Drama", "Historical"],
      "language": ["Telugu", "Hindi", "Tamil"],
      "duration": 187,
      "releaseDate": "2022-03-25T00:00:00.000Z",
      "rating": "UA",
      "posterUrl": "https://example.com/rrr-poster.jpg",
      "trailerUrl": "",
      "cast": [
        { "name": "Ram Charan", "role": "Alluri Sitarama Raju" }
      ],
      "director": "S.S. Rajamouli",
      "imdbRating": 7.9,
      "isNowShowing": true,
      "isUpcoming": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Get Single Movie
Retrieves detailed information about a specific movie.

**Endpoint:** `GET /movies/:id`

**Response:** `200 OK`
```json
{
  "success": true,
  "movie": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "title": "RRR",
    ...
  }
}
```

### Create Movie (Admin Only)
Creates a new movie.

**Endpoint:** `POST /movies`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "title": "Salaar",
  "description": "A gang leader tries to keep a promise...",
  "genre": ["Action", "Thriller"],
  "language": ["Telugu", "Hindi"],
  "duration": 175,
  "releaseDate": "2027-12-22",
  "rating": "A",
  "posterUrl": "https://example.com/salaar.jpg",
  "director": "Prashanth Neel",
  "cast": [
    { "name": "Prabhas", "role": "Salaar" }
  ],
  "imdbRating": 7.5,
  "isNowShowing": false,
  "isUpcoming": true
}
```

**Response:** `201 Created`

### Update Movie (Admin Only)
Updates an existing movie.

**Endpoint:** `PUT /movies/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:** (same as create, all fields optional)

**Response:** `200 OK`

### Delete Movie (Admin Only)
Deletes a movie.

**Endpoint:** `DELETE /movies/:id`

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

---

## 🏢 Cinema Endpoints

### Get All Cinemas
Retrieves list of active cinemas.

**Endpoint:** `GET /cinemas`

**Query Parameters:**
- `city` - Filter by city name

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "cinemas": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "PVR Cinemas",
      "location": {
        "address": "Forum Sujana Mall, Kukatpally",
        "city": "Hyderabad",
        "state": "Telangana",
        "pincode": "500072"
      },
      "screens": [
        {
          "name": "Screen 1",
          "totalSeats": 80,
          "rows": 8,
          "columns": 10
        }
      ],
      "amenities": ["Parking", "Food Court", "Wheelchair Accessible"],
      "contactNumber": "+91-40-12345678",
      "isActive": true
    }
  ]
}
```

### Get Single Cinema
**Endpoint:** `GET /cinemas/:id`

### Create Cinema (Admin Only)
**Endpoint:** `POST /cinemas`

### Update Cinema (Admin Only)
**Endpoint:** `PUT /cinemas/:id`

### Delete Cinema (Admin Only)
**Endpoint:** `DELETE /cinemas/:id`

---

## 🎭 Show Endpoints

### Get All Shows
Retrieves shows with optional filters.

**Endpoint:** `GET /shows`

**Query Parameters:**
- `movieId` - Filter by movie ID
- `cinemaId` - Filter by cinema ID
- `date` - Filter by date (YYYY-MM-DD format)

**Examples:**
```
GET /shows?movieId=64a1b2c3d4e5f6g7h8i9j0k1
GET /shows?movieId=64a1b2c3d4e5f6g7h8i9j0k1&date=2026-07-06
GET /shows?cinemaId=64a1b2c3d4e5f6g7h8i9j0k2
```

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 5,
  "shows": [
    {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
      "movie": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "title": "RRR",
        "posterUrl": "...",
        "duration": 187,
        "genre": ["Action", "Drama"],
        "rating": "UA"
      },
      "cinema": {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
        "name": "PVR Cinemas",
        "location": {
          "address": "...",
          "city": "Hyderabad"
        }
      },
      "screenName": "Screen 1",
      "showDate": "2026-07-06T00:00:00.000Z",
      "showTime": "10:00 AM",
      "language": "Telugu",
      "format": "2D",
      "ticketPrice": {
        "silver": 120,
        "gold": 200,
        "platinum": 350
      },
      "totalSeats": 80,
      "availableSeats": 75,
      "bookedSeats": ["A1", "A2", "B5", "C3", "D7"],
      "isActive": true
    }
  ]
}
```

### Get Single Show
**Endpoint:** `GET /shows/:id`

### Create Show (Admin Only)
**Endpoint:** `POST /shows`

**Request Body:**
```json
{
  "movie": "64a1b2c3d4e5f6g7h8i9j0k1",
  "cinema": "64a1b2c3d4e5f6g7h8i9j0k2",
  "screenName": "Screen 1",
  "showDate": "2026-07-10",
  "showTime": "10:00 AM",
  "language": "Telugu",
  "format": "2D",
  "ticketPrice": {
    "silver": 150,
    "gold": 250,
    "platinum": 400
  },
  "totalSeats": 80
}
```

### Update Show (Admin Only)
**Endpoint:** `PUT /shows/:id`

### Delete Show (Admin Only)
**Endpoint:** `DELETE /shows/:id`

---

## 🎫 Booking Endpoints

### Create Booking
Creates a new ticket booking.

**Endpoint:** `POST /bookings`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "showId": "64a1b2c3d4e5f6g7h8i9j0k3",
  "seats": ["A1", "A2", "A3"],
  "seatCategory": "gold",
  "paymentMethod": "upi"
}
```

**Field Details:**
- `seatCategory`: "silver" | "gold" | "platinum"
- `paymentMethod`: "card" | "upi" | "netbanking" | "wallet"

**Response:** `201 Created`
```json
{
  "success": true,
  "booking": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
    "user": "64a1b2c3d4e5f6g7h8i9j0k1",
    "show": {
      "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
      "showDate": "2026-07-06T00:00:00.000Z",
      "showTime": "10:00 AM",
      "language": "Telugu",
      "format": "2D",
      "movie": {
        "title": "RRR",
        "posterUrl": "...",
        "duration": 187
      },
      "cinema": {
        "name": "PVR Cinemas",
        "location": {...}
      }
    },
    "seats": ["A1", "A2", "A3"],
    "seatCategory": "gold",
    "totalAmount": 630,
    "bookingStatus": "confirmed",
    "paymentStatus": "paid",
    "paymentMethod": "upi",
    "bookingId": "MC1A2B3C4D",
    "convenienceFee": 30,
    "createdAt": "2026-07-05T10:30:00.000Z"
  }
}
```

### Get My Bookings
Retrieves all bookings for authenticated user.

**Endpoint:** `GET /bookings/my`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "count": 3,
  "bookings": [...]
}
```

### Get Single Booking
**Endpoint:** `GET /bookings/:id`

**Headers:** `Authorization: Bearer <token>`

### Cancel Booking
Cancels a booking and releases seats.

**Endpoint:** `PATCH /bookings/:id/cancel`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Booking cancelled and refund initiated",
  "booking": {...}
}
```

### Get All Bookings (Admin Only)
**Endpoint:** `GET /bookings`

**Headers:** `Authorization: Bearer <admin_token>`

---

## 👤 User Endpoints

### Get User Profile
**Endpoint:** `GET /users/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "role": "user",
    "bookings": [...]
  }
}
```

### Update Profile
**Endpoint:** `PUT /users/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+91-9999999999"
}
```

### Get All Users (Admin Only)
**Endpoint:** `GET /users`

**Headers:** `Authorization: Bearer <admin_token>`

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Common Workflows

### Complete Booking Flow

1. **Login/Register**
   ```
   POST /auth/login
   → Save token
   ```

2. **Browse Movies**
   ```
   GET /movies?status=nowShowing
   → Get movie list
   ```

3. **Get Shows for Movie**
   ```
   GET /shows?movieId=<id>&date=2026-07-06
   → Get available shows
   ```

4. **View Show Details**
   ```
   GET /shows/<showId>
   → Check seat availability
   ```

5. **Create Booking**
   ```
   POST /bookings
   Body: {showId, seats, seatCategory, paymentMethod}
   → Booking confirmed
   ```

6. **View Booking**
   ```
   GET /bookings/my
   → See ticket details
   ```

---

**API Version:** 1.0  
**Last Updated:** July 2026
