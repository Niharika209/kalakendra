import express from "express";
import {
  createReview,
  getWorkshopReviews,
  getLearnerReviews,
  getArtistReviews,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

// Create a review
router.post("/", createReview);

// Get reviews for a workshop
router.get("/workshop/:workshopId", getWorkshopReviews);

// Get reviews by a learner
router.get("/learner/:learnerId", getLearnerReviews);

// Get reviews for an artist
router.get("/artist/:artistId", getArtistReviews);

// Update a review
router.put("/:id", updateReview);

// Delete a review
router.delete("/:id", deleteReview);

export default router;
