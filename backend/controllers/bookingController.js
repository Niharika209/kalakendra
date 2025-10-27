import Booking from "../models/Booking.js";

// CREATE - Create a booking
export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ - Get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("workshop")
      .populate("learner");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - Get single booking by ID
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("workshop")
      .populate("learner");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - Get all bookings by learner
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

// UPDATE - Update booking
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("workshop").populate("learner");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE - Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
