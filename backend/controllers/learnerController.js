import Learner from "../models/Learner.js";

// Signup a new learner
export const createLearner = async (req, res) => {
  try {
    const learner = await Learner.create(req.body);
    res.status(201).json(learner);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
