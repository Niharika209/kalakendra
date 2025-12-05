import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import artistRoutes from "./routes/artistRoutes.js";
import learnerRoutes from "./routes/learnerRoutes.js";
import workshopRoutes from "./routes/workshopRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import demoBookingRoutes from "./routes/demoBookingRoutes.js";

// Import middleware
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Enable CORS for frontend dev servers.
// Accept either a single origin in CLIENT_ORIGIN or a comma-separated list.
const rawOrigins = process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:5174';
const allowedOrigins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);
// Ensure common dev origin is present (Vite default is 5173)
if (!allowedOrigins.includes('http://localhost:5173')) allowedOrigins.push('http://localhost:5173');
console.log('CORS allowed origins:', allowedOrigins);
app.use(cors({
  origin: function(origin, callback) {
    // allow non-browser requests (e.g., curl, server-to-server) when origin is undefined
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/artists", artistRoutes);
app.use("/api/learners", learnerRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/demo-bookings", demoBookingRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
