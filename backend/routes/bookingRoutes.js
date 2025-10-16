import express from "express";
import { createBooking, getBookingsByLearner } from "../controllers/bookingController.js";
import { learnerAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create booking (requires learner auth)
router.post("/", learnerAuth, createBooking);

// Get bookings for a learner
router.get("/learner/:learnerId", getBookingsByLearner);

export default router;
