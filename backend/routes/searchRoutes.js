import express from 'express';
import { searchArtists, searchWorkshops, autocomplete } from '../controllers/searchController.js';

const router = express.Router();

// Search endpoints
router.get('/artists', searchArtists);
router.get('/workshops', searchWorkshops);
router.get('/autocomplete', autocomplete);

export default router;
