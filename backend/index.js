import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Import routes
import artistRoutes from "./routes/artistRoutes.js";
import learnerRoutes from "./routes/learnerRoutes.js";
import workshopRoutes from "./routes/workshopRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

// Import middleware
import { errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // parse JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/artists", artistRoutes);
app.use("/api/learners", learnerRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/bookings", bookingRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
