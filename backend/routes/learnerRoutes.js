import express from "express";
import { 
  createLearner, 
  loginLearner, 
  getAllLearners, 
  getLearnerById, 
  updateLearner, 
  deleteLearner 
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

// DELETE - Delete learner
router.delete("/:id", deleteLearner);

// Login
router.post("/login", loginLearner);

export default router;
