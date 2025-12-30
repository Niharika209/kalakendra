import express from "express";
import { 
  createBooking, 
  getAllBookings, 
  getBookingById, 
  getBookingsByLearner, 
  updateBooking, 
  deleteBooking 
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);

router.get("/", getAllBookings);

router.get("/:id", getBookingById);

router.get("/learner/:learnerId", getBookingsByLearner);

router.put("/:id", updateBooking);

router.delete("/:id", deleteBooking);

export default router;
