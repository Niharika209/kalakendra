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

router.post("/", createLearner);

router.get("/", getAllLearners);

router.get("/:id", getLearnerById);

router.put("/:id", updateLearner);

router.put("/:id/profile-image", updateLearnerProfileImage);

router.delete("/:id/profile-image", deleteLearnerProfileImage);

router.delete("/:id", deleteLearner);

// Login
router.post("/login", loginLearner);

export default router;
