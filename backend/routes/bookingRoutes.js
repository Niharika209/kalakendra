import express from "express";
import { 
  createBooking, 
  getAllBookings, 
  getBookingById, 
  getBookingsByLearner,
  getBookingsByArtist, 
  updateBooking, 
  deleteBooking 
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE - Create booking (requires authentication)
router.post("/", protect, createBooking);

// READ - Get all bookings
router.get("/", getAllBookings);

// READ - Get bookings for a learner (specific routes before generic :id)
router.get("/learner/:learnerId", getBookingsByLearner);

// READ - Get bookings for artist's workshops (specific routes before generic :id)
router.get("/artist/:artistId", getBookingsByArtist);

// READ - Get single booking by ID (generic :id route comes last)
router.get("/:id", getBookingById);

// UPDATE - Update booking
router.put("/:id", updateBooking);

// DELETE - Delete booking
router.delete("/:id", deleteBooking);

export default router;
