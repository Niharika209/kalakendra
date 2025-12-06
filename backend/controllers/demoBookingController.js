import DemoBooking from '../models/DemoBooking.js';
import Artist from '../models/Artist.js';
import Learner from '../models/Learner.js';

// CREATE - Book a demo session
export const createDemoBooking = async (req, res) => {
  try {
    console.log('📝 Creating demo booking:', req.body);
    
    const { artistId, learnerEmail, sessionType, selectedSlot, sessionTitle, ...bookingData } = req.body;
    
    // Verify artist exists
    const artist = await Artist.findById(artistId);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }
    
    // Try to find learner by email
    const learner = await Learner.findOne({ email: learnerEmail });
    
    // Create booking
    const demoBooking = new DemoBooking({
      artistId,
      learnerId: learner?._id || null,
      learnerEmail,
      sessionType,
      sessionTitle: sessionTitle || 'Demo Session',
      selectedSlot: sessionType === 'live' ? selectedSlot : null,
      status: 'confirmed',
      ...bookingData
    });
    
    await demoBooking.save();
    
    console.log('✅ Demo booking created:', demoBooking._id);
    res.status(201).json({
      success: true,
      booking: demoBooking,
      message: `Demo session confirmed! You'll receive details at ${learnerEmail}.`
    });
  } catch (err) {
    console.error('❌ Error creating demo booking:', err);
    res.status(400).json({ error: err.message });
  }
};

// GET - Get all demo bookings for an artist
export const getArtistDemoBookings = async (req, res) => {
  try {
    const { artistId } = req.params;
    console.log('🔍 Fetching demo bookings for artist:', artistId);
    
    const bookings = await DemoBooking.find({ artistId })
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('✅ Found', bookings.length, 'demo bookings');
    res.json(bookings);
  } catch (err) {
    console.error('❌ Error fetching demo bookings:', err);
    res.status(500).json({ error: err.message });
  }
};

// GET - Get all demo bookings for a learner by email
export const getLearnerDemoBookings = async (req, res) => {
  try {
    const { email } = req.params;
    console.log('🔍 Fetching demo bookings for learner:', email);
    
    const bookings = await DemoBooking.find({ learnerEmail: email })
      .populate('artistId', 'name email profileImage category')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log('✅ Found', bookings.length, 'demo bookings');
    res.json(bookings);
  } catch (err) {
    console.error('❌ Error fetching learner demo bookings:', err);
    res.status(500).json({ error: err.message });
  }
};

// PATCH - Update demo booking status
export const updateDemoBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log('📝 Updating demo booking status:', id, 'to', status);
    
    const booking = await DemoBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    console.log('✅ Demo booking updated');
    res.json(booking);
  } catch (err) {
    console.error('❌ Error updating demo booking:', err);
    res.status(400).json({ error: err.message });
  }
};

// DELETE - Cancel a demo booking
export const deleteDemoBooking = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️  Deleting demo booking:', id);
    
    const booking = await DemoBooking.findByIdAndDelete(id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    console.log('✅ Demo booking deleted');
    res.json({ message: 'Demo booking cancelled successfully' });
  } catch (err) {
    console.error('❌ Error deleting demo booking:', err);
    res.status(500).json({ error: err.message });
  }
};
