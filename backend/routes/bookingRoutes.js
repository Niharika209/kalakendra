import express from "express";
import { 
  createBooking, 
  getAllBookings, 
  getBookingById, 
  getBookingsByLearner, 
  updateBooking, 
  deleteBooking 
} from "../controllers/bookingController.js";
import { learnerAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE - Create booking (requires learner auth)
router.post("/", learnerAuth, createBooking);

// READ - Get all bookings
router.get("/", getAllBookings);

// READ - Get single booking by ID
router.get("/:id", getBookingById);

// READ - Get bookings for a learner
router.get("/learner/:learnerId", getBookingsByLearner);

// UPDATE - Update booking
router.put("/:id", updateBooking);

// DELETE - Delete booking
router.delete("/:id", deleteBooking);

export default router;
