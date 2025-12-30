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

router.post("/", createReview);

router.get("/workshop/:workshopId", getWorkshopReviews);

router.get("/learner/:learnerId", getLearnerReviews);

router.get("/artist/:artistId", getArtistReviews);

router.put("/:id", updateReview);

router.delete("/:id", deleteReview);

export default router;
