#  KalaKendra 

Find real artists. Book real workshops.

Kalakendra is a MERN‑stack platform for discovering working artists who actually teach not just celebrities who do shows. It brings together dance, music, visual arts, pottery and more into one place where learners can browse workshops, compare options, and book in a few clicks.


##  Tech Stack

### Frontend
- React 19
- Vite
- TailwindCSS 4

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image hosting)
- Razorpay (Payments)

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/niharika209/kalakendra.git
cd kalakendra
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_ORIGIN=http://localhost:5173
PORT=5000
```

Start the backend:
```bash
npm start
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the frontend:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`




##  API Documentation

### Main Endpoints

- POST /api/auth/signup - User registration
- POST /api/auth/login - User login
- GET /api/artists - Get all artists
- GET /api/workshops - Get all workshops
- POST /api/bookings - Create booking
- POST /api/payment/create-order - Create Razorpay order