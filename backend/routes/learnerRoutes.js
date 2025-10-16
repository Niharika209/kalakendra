import express from "express";
import { createLearner, loginLearner } from "../controllers/learnerController.js";

const router = express.Router();

// Signup
router.post("/", createLearner);

// Login
router.post("/login", loginLearner);

export default router;
