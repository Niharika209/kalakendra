import Learner from "../models/Learner.js";
import { deleteFromCloudinary } from "../utils/cloudinaryHelper.js";

export const createLearner = async (req, res) => {
  try {
    const learner = await Learner.create(req.body);
    res.status(201).json(learner);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllLearners = async (req, res) => {
  try {
    const learners = await Learner.find();
    res.json(learners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getLearnerById = async (req, res) => {
  try {
    const learner = await Learner.findById(req.params.id);
    if (!learner) return res.status(404).json({ error: "Learner not found" });
    res.json(learner);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

export const deleteLearner = async (req, res) => {
  try {
    const learner = await Learner.findByIdAndDelete(req.params.id);
    if (!learner) return res.status(404).json({ error: "Learner not found" });
    res.json({ message: "Learner deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

export const updateLearnerProfileImage = async (req, res) => {
  try {
    const { profileImage } = req.body;
    
    if (!profileImage) {
      return res.status(400).json({ error: "profileImage URL is required" });
    }

    const learner = await Learner.findByIdAndUpdate(
      req.params.id,
      { profileImage },
      { new: true, runValidators: true }
    );

    if (!learner) return res.status(404).json({ error: "Learner not found" });
    
    res.json({ 
      message: "Profile image updated successfully", 
      profileImage: learner.profileImage
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteLearnerProfileImage = async (req, res) => {
  try {
    const learner = await Learner.findById(req.params.id);
    if (!learner) return res.status(404).json({ error: "Learner not found" });
    
    if (learner.profileImage) {
      try {
        await deleteFromCloudinary(learner.profileImage);
        console.log('Image deleted from Cloudinary');
      } catch (cloudinaryError) {
        console.error('Failed to delete from Cloudinary:', cloudinaryError);
      }
    }
    learner.profileImage = undefined;
    await learner.save();
    
    res.json({ 
      message: "Profile image deleted successfully"
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
