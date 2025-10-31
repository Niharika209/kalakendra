import mongoose from "mongoose";
import dotenv from "dotenv";
import Artist from "../models/Artist.js";
import https from 'https';

// use Node's fetch if available (Node 18+). If not available, fallback to https request to resolve redirects.
const resolveRedirect = async (url) => {
  if (typeof fetch === 'function') {
    try {
      const resp = await fetch(url, { method: 'GET', redirect: 'follow' });
      // resp.url is the final URL after redirects
      return resp.url || url;
    } catch (err) {
      console.warn('fetch failed resolving', url, err.message);
      return url;
    }
  }

  // Fallback: perform a HEAD request and follow redirects manually
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      const final = res.headers.location || url;
      resolve(final);
    });
    req.on('error', () => resolve(url));
    req.end();
  });
};

dotenv.config();

const artists = [
  {
    name: "Rajesh Kumar",
    category: "Painter",
    bio: "Experienced landscape and portrait painter.",
    location: "Jaipur",
    // direct image via Unsplash source (redirects to the actual image)
    imageUrl: "https://source.unsplash.com/BI91NrppE38/800x600",
    thumbnailUrl: "https://source.unsplash.com/BI91NrppE38/400x300",
  },
  {
    name: "Priya Sharma",
    category: "Vocalist",
    bio: "Classical vocalist and workshop instructor.",
    location: "Delhi",
    imageUrl: "https://source.unsplash.com/n1B6ftPB5Eg/800x600",
    thumbnailUrl: "https://source.unsplash.com/n1B6ftPB5Eg/400x300",
  },
  {
    name: "Ananya Desai",
    category: "Sculptor",
    bio: "Contemporary sculptor working with mixed media.",
    location: "Bengaluru",
    imageUrl: "https://source.unsplash.com/gG70fyu3qsg/800x600",
    thumbnailUrl: "https://source.unsplash.com/gG70fyu3qsg/400x300",
  },
  {
    name: "Mohit Verma",
    category: "Photographer",
    bio: "Street and portrait photographer.",
    location: "Mumbai",
    imageUrl: "https://source.unsplash.com/8BcVHmAHtlw/800x600",
    thumbnailUrl: "https://source.unsplash.com/8BcVHmAHtlw/400x300",
  },
];

const seed = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI not set in environment. Add it to .env before running the seed script.");
    }

    await mongoose.connect(uri);
    console.log("Connected to MongoDB — seeding featured artists...");

    for (const data of artists) {
      // Resolve the source.unsplash links to final images so the frontend can load them directly
      if (data.imageUrl && data.imageUrl.includes('source.unsplash.com')) {
        try {
          const finalLarge = await resolveRedirect(data.imageUrl);
          const finalThumb = await resolveRedirect(data.thumbnailUrl);
          data.imageUrl = finalLarge;
          data.thumbnailUrl = finalThumb;
        } catch (err) {
          console.warn('Could not resolve unsplash redirect for', data.name, err.message);
        }
      }

      const updated = await Artist.findOneAndUpdate(
        { name: data.name },
        { $set: data },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`Upserted artist: ${updated.name} (id: ${updated._id})`);
    }

    console.log("Seeding completed.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seed();
