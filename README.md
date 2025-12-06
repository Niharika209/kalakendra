# 🎨 KalaKendra - Online Workshop Platform

A full-stack MERN application connecting artists with learners through online workshops.

## 🚀 Features

- **Artist Profiles**: Showcase portfolios, specialties, and workshops
- **Workshop Management**: Create, edit, and manage workshops
- **Booking System**: Seamless enrollment with payment integration
- **Demo Sessions**: Offer live or recorded demo sessions
- **Search & Filters**: Advanced search for workshops and artists
- **Reviews & Ratings**: Rate and review workshops
- **Secure Payments**: Razorpay payment gateway integration
- **Media Management**: Cloudinary-powered image and video uploads

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- TailwindCSS 4
- React Router DOM
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image hosting)
- Razorpay (Payments)

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Razorpay account (test mode)

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

## 📁 Project Structure

```
kalakendra/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── index.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── assets/      # Images and static files
│   │   ├── components/  # React components
│   │   ├── config/      # Configuration
│   │   ├── context/     # React context
│   │   ├── pages/       # Page components
│   │   └── services/    # API services
│   └── public/          # Public assets
└── DEPLOYMENT.md        # Deployment guide
```

## 🗄️ Database Setup

### Seed Sample Data

```bash
cd backend

# Seed featured artists
npm run seed

# Seed all data (artists, workshops, etc.)
npm run seed:all

# Reindex search data
npm run reindex
```

## 🚀 Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Deploy Options:**
- Frontend: Vercel, Netlify
- Backend: Render, Railway, Heroku
- Database: MongoDB Atlas

## 📚 API Documentation

### Main Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/artists` - Get all artists
- `GET /api/workshops` - Get all workshops
- `POST /api/bookings` - Create booking
- `POST /api/payment/create-order` - Create Razorpay order

## 🔐 Environment Variables

### Backend Required Variables
- `MONGO_URI` - MongoDB connection string
- `JWT_ACCESS_SECRET` - JWT access token secret
- `JWT_REFRESH_SECRET` - JWT refresh token secret
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `RAZORPAY_KEY_ID` - Razorpay key ID
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `CLIENT_ORIGIN` - Frontend URL for CORS
- `PORT` - Server port (default: 5000)

### Frontend Required Variables
- `VITE_API_URL` - Backend API URL
- `VITE_RAZORPAY_KEY_ID` - Razorpay key for frontend

## 🧪 Testing

### Test Authentication
```bash
cd backend
node testAuth.js
```

### Test Signup
```bash
node testSignup.js
```

## 🛡️ Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation
- Secure environment variables

## 📱 Features in Detail

### For Artists
- Create and manage workshops
- Upload portfolio images and videos
- Set workshop pricing and schedules
- Track enrollments and revenue
- Offer demo sessions (live/recorded)
- Manage bookings

### For Learners
- Browse workshops by category
- Search and filter workshops
- Book multiple workshops
- Secure payment processing
- Access enrolled workshops
- Rate and review workshops
- Wishlist favorites

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- Niharika - [GitHub](https://github.com/niharika209)

## 🙏 Acknowledgments

- MongoDB for database
- Cloudinary for media management
- Razorpay for payment processing
- Vercel for hosting

## 📞 Support

For support, email your-email@example.com or create an issue in the repository.

## 🔄 Updates & Roadmap

- [ ] Add real-time notifications
- [ ] Implement chat system
- [ ] Add workshop scheduling calendar
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Made with ❤️ by the KalaKendra Team**
