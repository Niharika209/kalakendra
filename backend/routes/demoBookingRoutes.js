import express from 'express';
import {
  createDemoBooking,
  getArtistDemoBookings,
  getLearnerDemoBookings,
  updateDemoBookingStatus,
  deleteDemoBooking
} from '../controllers/demoBookingController.js';

const router = express.Router();

// POST /api/demo-bookings - Create a new demo booking
router.post('/', createDemoBooking);

// GET /api/demo-bookings/artist/:artistId - Get all bookings for an artist
router.get('/artist/:artistId', getArtistDemoBookings);

// GET /api/demo-bookings/learner/:email - Get all bookings for a learner
router.get('/learner/:email', getLearnerDemoBookings);

// PATCH /api/demo-bookings/:id - Update booking status
router.patch('/:id', updateDemoBookingStatus);

// DELETE /api/demo-bookings/:id - Cancel a booking
router.delete('/:id', deleteDemoBooking);

export default router;
