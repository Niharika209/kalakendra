import mongoose from "mongoose";
import dotenv from "dotenv";

// Import models
import Artist from "./models/Artist.js";
import Learner from "./models/Learner.js";
import Workshop from "./models/Workshop.js";
import Booking from "./models/Booking.js";

dotenv.config();

const test = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for testing");

    // 1️⃣ Create Artist
    const artist = await Artist.create({
      name: "John Doe",
      email: "john@example.com",
      password: "123456",
      category: "Singer",
      bio: "Professional singer",
      pricePerHour: 50,
      location: "Mumbai",
    });
    console.log("Artist created:", artist);

    // 2️⃣ Create Learner
    const learner = await Learner.create({
      name: "Priya Sharma",
      email: "priya@example.com",
      password: "123456",
      location: "Delhi",
    });
    console.log("Learner created:", learner);

    // 3️⃣ Create Workshop
    const workshop = await Workshop.create({
      title: "Singing Basics",
      artist: artist._id,
      date: new Date("2025-10-20T15:00:00Z"),
      price: 100,
      mode: "online",
      location: "Zoom",
    });
    console.log("Workshop created:", workshop);

    // 4️⃣ Create Booking
    const booking = await Booking.create({
      learner: learner._id,
      workshop: workshop._id,
    });
    console.log("Booking created:", booking);

    // Fetch all workshops and populate artist
    const workshops = await Workshop.find().populate("artist");
    console.log("All workshops with artist populated:", workshops);

    // Fetch bookings for learner
    const bookings = await Booking.find({ learner: learner._id })
      .populate("learner")
      .populate("workshop");
    console.log("Bookings for learner:", bookings);

    console.log("✅ All tests completed successfully!");
    process.exit(0); // Exit after tests
  } catch (err) {
    console.error("❌ Test failed:", err);
    process.exit(1);
  }
};

test();
