import Booking from "../models/Booking.js";

// Create a booking
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all bookings by learner
export const getBookingsByLearner = async (req, res) => {
  try {
    const bookings = await Booking.find({ learner: req.params.learnerId })
      .populate("workshop")
      .populate("learner");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
