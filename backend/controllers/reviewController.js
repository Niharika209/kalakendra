import Review from "../models/Review.js";
import Workshop from "../models/Workshop.js";
import Artist from "../models/Artist.js";

// CREATE - Submit a review
export const createReview = async (req, res) => {
  try {
    const { workshopId, rating, comment, learnerName, learnerId } = req.body;

    // Validate required fields
    if (!workshopId || !rating || !comment || !learnerName || !learnerId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get workshop and artist info
    const workshop = await Workshop.findById(workshopId).populate('artist');
    if (!workshop) {
      return res.status(404).json({ error: "Workshop not found" });
    }

    // Check if learner already reviewed this workshop
    const existingReview = await Review.findOne({ 
      workshop: workshopId, 
      learner: learnerId 
    });
    
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this workshop" });
    }

    // Create review
    const review = await Review.create({
      workshop: workshopId,
      learner: learnerId,
      artist: workshop.artist._id,
      rating,
      comment,
      reviewerName: learnerName
    });

    // Update artist's testimonials
    await Artist.findByIdAndUpdate(
      workshop.artist._id,
      {
        $push: {
          testimonials: {
            name: learnerName,
            rating,
            text: comment,
            date: new Date()
          }
        }
      }
    );

    // Update artist rating and review count
    const artistReviews = await Review.find({ artist: workshop.artist._id });
    const avgRating = artistReviews.reduce((sum, r) => sum + r.rating, 0) / artistReviews.length;
    
    await Artist.findByIdAndUpdate(workshop.artist._id, {
      rating: Math.round(avgRating * 10) / 10,
      reviewsCount: artistReviews.length
    });

    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "You have already reviewed this workshop" });
    }
    res.status(400).json({ error: err.message });
  }
};

// READ - Get all reviews for a workshop
export const getWorkshopReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ workshop: req.params.workshopId })
      .populate("learner", "name email")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - Get all reviews by a learner
export const getLearnerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ learner: req.params.learnerId })
      .populate("workshop", "title")
      .populate("artist", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ - Get all reviews for an artist
export const getArtistReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ artist: req.params.artistId })
      .populate("workshop", "title")
      .populate("learner", "name")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE - Update a review
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Update review
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    // Update artist testimonials
    const artist = await Artist.findById(review.artist);
    const testimonialIndex = artist.testimonials.findIndex(
      t => t.name === review.reviewerName && 
      Math.abs(new Date(t.date) - new Date(review.createdAt)) < 1000
    );
    
    if (testimonialIndex !== -1) {
      artist.testimonials[testimonialIndex].rating = review.rating;
      artist.testimonials[testimonialIndex].text = review.comment;
      await artist.save();
    }

    // Recalculate artist rating
    const artistReviews = await Review.find({ artist: review.artist });
    const avgRating = artistReviews.reduce((sum, r) => sum + r.rating, 0) / artistReviews.length;
    
    await Artist.findByIdAndUpdate(review.artist, {
      rating: Math.round(avgRating * 10) / 10
    });

    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE - Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    const artistId = review.artist;
    
    // Delete review
    await Review.findByIdAndDelete(req.params.id);

    // Remove from artist testimonials
    await Artist.findByIdAndUpdate(artistId, {
      $pull: {
        testimonials: {
          name: review.reviewerName,
          text: review.comment
        }
      }
    });

    // Recalculate artist rating and count
    const artistReviews = await Review.find({ artist: artistId });
    const avgRating = artistReviews.length > 0 
      ? artistReviews.reduce((sum, r) => sum + r.rating, 0) / artistReviews.length 
      : 0;
    
    await Artist.findByIdAndUpdate(artistId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewsCount: artistReviews.length
    });

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
