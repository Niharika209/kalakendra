import express from "express";
import { 
  createLearner, 
  loginLearner, 
  getAllLearners, 
  getLearnerById, 
  updateLearner, 
  deleteLearner,
  updateLearnerProfileImage,
  deleteLearnerProfileImage
} from "../controllers/learnerController.js";

const router = express.Router();

// CREATE - Signup
router.post("/", createLearner);

// READ - Get all learners
router.get("/", getAllLearners);

// READ - Get single learner by ID
router.get("/:id", getLearnerById);

// UPDATE - Update learner
router.put("/:id", updateLearner);

// UPDATE - Update learner profile image
router.put("/:id/profile-image", updateLearnerProfileImage);

// DELETE - Delete learner profile image
router.delete("/:id/profile-image", deleteLearnerProfileImage);

// DELETE - Delete learner
router.delete("/:id", deleteLearner);

// Login
router.post("/login", loginLearner);

export default router;
