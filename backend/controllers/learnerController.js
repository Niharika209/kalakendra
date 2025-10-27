import Learner from "../models/Learner.js";

// CREATE - Signup a new learner
export const createLearner = async (req, res) => {
  try {
    const learner = await Learner.create(req.body);
    res.status(201).json(learner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ - Get all learners
export const getAllLearners = async (req, res) => {
  try {
    const learners = await Learner.find();
    res.json(learners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - Get single learner by ID
export const getLearnerById = async (req, res) => {
  try {
    const learner = await Learner.findById(req.params.id);
    if (!learner) return res.status(404).json({ error: "Learner not found" });
    res.json(learner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE - Update learner profile
export const updateLearner = async (req, res) => {
  try {
    const learner = await Learner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!learner) return res.status(404).json({ error: "Learner not found" });
    res.json(learner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE - Delete learner
export const deleteLearner = async (req, res) => {
  try {
    const learner = await Learner.findByIdAndDelete(req.params.id);
    if (!learner) return res.status(404).json({ error: "Learner not found" });
    res.json({ message: "Learner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Learner login (basic)
export const loginLearner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const learner = await Learner.findOne({ email, password });
    if (!learner) return res.status(400).json({ error: "Invalid credentials" });
    res.json({ message: "Login successful", learner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
