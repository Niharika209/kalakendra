import Booking from "../models/Booking.js";
import Workshop from "../models/Workshop.js";

// CREATE - Create a booking
export const createBooking = async (req, res) => {
  try {
    console.log('📝 Creating booking:', req.body);
    
    const booking = await Booking.create(req.body);
    
    // Increment workshop enrolled count by quantity
    if (booking.workshop) {
      const incrementBy = booking.quantity || 1;
      await Workshop.findByIdAndUpdate(
        booking.workshop,
        { 
          $inc: { 
            enrolled: incrementBy,
            revenue: booking.totalAmount || 0
          } 
        }
      );
      console.log(`✅ Incremented enrolled count for workshop ${booking.workshop} by ${incrementBy}`);
      console.log(`✅ Added revenue: ₹${booking.totalAmount || 0}`);
    }
    
    const populatedBooking = await Booking.findById(booking._id)
      .populate("workshop")
      .populate("learner");
    
    console.log('✅ Booking created successfully');
    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error('❌ Error creating booking:', err);
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
    console.log('🗑️  Deleting booking:', req.params.id);
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    
    // Decrement workshop enrolled count by quantity
    if (booking.workshop) {
      const decrementBy = booking.quantity || 1;
      await Workshop.findByIdAndUpdate(
        booking.workshop,
        { 
          $inc: { 
            enrolled: -decrementBy,
            revenue: -(booking.totalAmount || 0)
          } 
        }
      );
      console.log(`✅ Decremented enrolled count for workshop ${booking.workshop} by ${decrementBy}`);
      console.log(`✅ Reduced revenue: ₹${booking.totalAmount || 0}`);
    }
    
    await Booking.findByIdAndDelete(req.params.id);
    console.log('✅ Booking deleted successfully');
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error('❌ Error deleting booking:', err);
    res.status(500).json({ error: err.message });
  }
};
