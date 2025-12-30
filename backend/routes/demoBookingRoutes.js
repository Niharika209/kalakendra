import express from 'express';
import {
  createDemoBooking,
  getArtistDemoBookings,
  getLearnerDemoBookings,
  updateDemoBookingStatus,
  deleteDemoBooking
} from '../controllers/demoBookingController.js';

const router = express.Router();

router.post('/', createDemoBooking);

router.get('/artist/:artistId', getArtistDemoBookings);

router.get('/learner/:email', getLearnerDemoBookings);

router.patch('/:id', updateDemoBookingStatus);

router.delete('/:id', deleteDemoBooking);

export default router;
