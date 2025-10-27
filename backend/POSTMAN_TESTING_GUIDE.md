# Kalakendra API - Postman Testing Guide

## Base URL
```
http://localhost:5000/api
```

---

## 1. ARTIST ENDPOINTS

### 1.1 CREATE Artist (Signup)
- **Method:** POST
- **URL:** `http://localhost:5000/api/artists`
- **Body (JSON):**
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "password123",
  "category": "Dance",
  "bio": "Classical Bharatanatyam dancer with 10 years experience",
  "location": "Mumbai, Maharashtra",
  "pricePerHour": 500
}
```

### 1.2 READ All Artists
- **Method:** GET
- **URL:** `http://localhost:5000/api/artists`

### 1.3 READ Single Artist by ID
- **Method:** GET
- **URL:** `http://localhost:5000/api/artists/{artistId}`
- **Example:** `http://localhost:5000/api/artists/67123abc456def789`

### 1.4 UPDATE Artist
- **Method:** PUT
- **URL:** `http://localhost:5000/api/artists/{artistId}`
- **Body (JSON):**
```json
{
  "bio": "Updated bio - Classical Bharatanatyam dancer with 15 years experience",
  "pricePerHour": 600
}
```

### 1.5 DELETE Artist
- **Method:** DELETE
- **URL:** `http://localhost:5000/api/artists/{artistId}`

### 1.6 Artist Login
- **Method:** POST
- **URL:** `http://localhost:5000/api/artists/login`
- **Body (JSON):**
```json
{
  "email": "priya@example.com",
  "password": "password123"
}
```

---

## 2. LEARNER ENDPOINTS

### 2.1 CREATE Learner (Signup)
- **Method:** POST
- **URL:** `http://localhost:5000/api/learners`
- **Body (JSON):**
```json
{
  "name": "Rahul Kumar",
  "email": "rahul@example.com",
  "password": "password123",
  "location": "Delhi, India"
}
```

### 2.2 READ All Learners
- **Method:** GET
- **URL:** `http://localhost:5000/api/learners`

### 2.3 READ Single Learner by ID
- **Method:** GET
- **URL:** `http://localhost:5000/api/learners/{learnerId}`
- **Example:** `http://localhost:5000/api/learners/67123abc456def789`

### 2.4 UPDATE Learner
- **Method:** PUT
- **URL:** `http://localhost:5000/api/learners/{learnerId}`
- **Body (JSON):**
```json
{
  "name": "Rahul Kumar Singh",
  "location": "New Delhi, India"
}
```

### 2.5 DELETE Learner
- **Method:** DELETE
- **URL:** `http://localhost:5000/api/learners/{learnerId}`

### 2.6 Learner Login
- **Method:** POST
- **URL:** `http://localhost:5000/api/learners/login`
- **Body (JSON):**
```json
{
  "email": "rahul@example.com",
  "password": "password123"
}
```

---

## 3. WORKSHOP ENDPOINTS

### 3.1 CREATE Workshop (Requires Artist Auth)
- **Method:** POST
- **URL:** `http://localhost:5000/api/workshops`
- **Body (JSON):**
```json
{
  "title": "Bharatanatyam for Beginners",
  "artist": "67123abc456def789",
  "date": "2025-11-15T10:00:00",
  "price": 1500,
  "mode": "online",
  "location": "",
  "email": "priya@example.com",
  "password": "password123"
}
```

### 3.2 READ All Workshops
- **Method:** GET
- **URL:** `http://localhost:5000/api/workshops`

### 3.3 READ Single Workshop by ID
- **Method:** GET
- **URL:** `http://localhost:5000/api/workshops/{workshopId}`
- **Example:** `http://localhost:5000/api/workshops/67123abc456def789`

### 3.4 UPDATE Workshop
- **Method:** PUT
- **URL:** `http://localhost:5000/api/workshops/{workshopId}`
- **Body (JSON):**
```json
{
  "price": 2000,
  "mode": "offline",
  "location": "Mumbai Dance Academy, Andheri"
}
```

### 3.5 DELETE Workshop
- **Method:** DELETE
- **URL:** `http://localhost:5000/api/workshops/{workshopId}`

---

## 4. BOOKING ENDPOINTS

### 4.1 CREATE Booking (Requires Learner Auth)
- **Method:** POST
- **URL:** `http://localhost:5000/api/bookings`
- **Body (JSON):**
```json
{
  "learner": "67123abc456def789",
  "workshop": "67123xyz456def789",
  "email": "rahul@example.com",
  "password": "password123"
}
```

### 4.2 READ All Bookings
- **Method:** GET
- **URL:** `http://localhost:5000/api/bookings`

### 4.3 READ Single Booking by ID
- **Method:** GET
- **URL:** `http://localhost:5000/api/bookings/{bookingId}`
- **Example:** `http://localhost:5000/api/bookings/67123abc456def789`

### 4.4 READ Bookings by Learner
- **Method:** GET
- **URL:** `http://localhost:5000/api/bookings/learner/{learnerId}`
- **Example:** `http://localhost:5000/api/bookings/learner/67123abc456def789`

### 4.5 UPDATE Booking
- **Method:** PUT
- **URL:** `http://localhost:5000/api/bookings/{bookingId}`
- **Body (JSON):**
```json
{
  "status": "confirmed"
}
```

### 4.6 DELETE Booking
- **Method:** DELETE
- **URL:** `http://localhost:5000/api/bookings/{bookingId}`

---

## TESTING SEQUENCE

Follow this order to test the complete flow:

1. **Create Artist** (POST /api/artists)
2. **Login Artist** (POST /api/artists/login) - Note the artist ID
3. **Create Learner** (POST /api/learners)
4. **Login Learner** (POST /api/learners/login) - Note the learner ID
5. **Create Workshop** (POST /api/workshops) - Use artist ID and credentials
6. **Get All Workshops** (GET /api/workshops) - Note the workshop ID
7. **Get Single Workshop** (GET /api/workshops/{id})
8. **Create Booking** (POST /api/bookings) - Use learner ID, workshop ID, and learner credentials
9. **Get Bookings by Learner** (GET /api/bookings/learner/{learnerId})
10. **Update Booking** (PUT /api/bookings/{id}) - Change status to "confirmed"
11. **Get All Bookings** (GET /api/bookings)

---

## POSTMAN SETUP TIPS

1. **Set up Environment Variables:**
   - Create a variable: `baseURL` = `http://localhost:5000/api`
   - Then use: `{{baseURL}}/artists` in your requests

2. **Save IDs from Responses:**
   - After creating an artist, copy the `_id` from response
   - Use it in subsequent requests

3. **Headers:**
   - Content-Type: `application/json` (automatically set for JSON body)

4. **Test Status Codes:**
   - 200: Success (GET, PUT)
   - 201: Created (POST)
   - 400: Bad Request (validation error)
   - 404: Not Found
   - 500: Server Error

---

## COMMON ERRORS TO CHECK

- **MongoDB not connected:** Make sure MongoDB URI in `.env` is correct
- **Port already in use:** Change PORT in `.env` or stop other processes on port 5000
- **Validation errors:** Check required fields in models
- **Auth errors:** Provide correct email/password in request body for protected routes

---

## START THE SERVER

Before testing, run:
```bash
cd backend
npm start
```

Server should start on `http://localhost:5000`
