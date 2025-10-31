import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Artist from '../models/Artist.js';
import Workshop from '../models/Workshop.js';
import Booking from '../models/Booking.js';
import https from 'https';

dotenv.config();

// Resolve redirects (like source.unsplash) to final image URLs
const resolveRedirect = async (url) => {
  if (!url) return url;
  if (typeof fetch === 'function') {
    try {
      const resp = await fetch(url, { method: 'GET', redirect: 'follow' });
      return resp.url || url;
    } catch (err) {
      console.warn('fetch failed resolving', url, err.message);
      return url;
    }
  }
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      resolve(res.headers.location || url);
    });
    req.on('error', () => resolve(url));
    req.end();
  });
};

const artistsSeed = [
  {
    name: 'Asha Patel',
    slug: 'asha-patel',
    email: 'asha@example.com',
    password: 'password',
    category: 'Painter',
    bio: 'Contemporary portrait and figure painter.',
    location: 'Ahmedabad',
    // use Unsplash portrait queries (sig param gives stable different images)
    imageUrl: 'https://source.unsplash.com/1200x900/?portrait&sig=11',
    thumbnailUrl: 'https://source.unsplash.com/400x300/?portrait&sig=11',
    pricePerHour: 900,
    featured: true,
    featuredOrder: 1,
    specialties: ['Portraits', 'Figure Painting', 'Oil'],
    experience: 6,
    students: 320,
  },
  {
    name: 'Vikram Rao',
    slug: 'vikram-rao',
    email: 'vikram@example.com',
    password: 'password',
    category: 'Vocalist',
    bio: 'Vocal coach and performance artist.',
    location: 'Mumbai',
    imageUrl: 'https://source.unsplash.com/1200x900/?portrait&sig=21',
    thumbnailUrl: 'https://source.unsplash.com/400x300/?portrait&sig=21',
    pricePerHour: 1100,
    featured: true,
    featuredOrder: 2,
    specialties: ['Classical Vocals', 'Performance', 'Voice Training'],
    experience: 12,
    students: 540,
  },
  {
    name: 'Simran Kaur',
    slug: 'simran-kaur',
    email: 'simran@example.com',
    password: 'password',
    category: 'Sculptor',
    bio: 'Works with mixed media and clay.',
    location: 'Bengaluru',
  // use local project asset for stable demo image (frontend serves src assets during dev)
  // This points to the profile image in `frontend/src/assets/profile.jpg`.
  imageUrl: '/src/assets/profile.jpg',
  thumbnailUrl: '/src/assets/profile.jpg',
    pricePerHour: 1000,
    featured: true,
    featuredOrder: 3,
    testimonials: [
      { name: 'Riya Sen', rating: 5, text: 'Amazing hands-on workshop — learned so much!', date: new Date() },
      { name: 'Aman Gupta', rating: 4.5, text: 'Very patient and creative instructor.', date: new Date() }
    ],
    experience: 8,
    about: 'Simran Kaur is an award-winning sculptor with a passion for blending traditional techniques and contemporary themes. She has led community workshops across India and specializes in mixed-media sculptures that explore cultural narratives. Her teaching focuses on conceptual development, material experimentation, and hands-on studio practice.',
    rating: 4.85,
    reviewsCount: 124,
    videos: [
      { title: 'Workshop Highlights — Simran Kaur', thumbnailUrl: '/src/assets/profile.jpg', url: 'https://example.com/videos/simran-highlights.mp4', duration: '5:12', views: 1240 },
      { title: 'Studio Tour with Simran', thumbnailUrl: '/src/assets/profile.jpg', url: 'https://example.com/videos/simran-studio.mp4', duration: '3:45', views: 860 }
    ],
    reviews: [
      { name: 'Anil Sharma', rating: 5, text: 'Transformed my approach to clay and composition — highly recommend.' },
      { name: 'Priya Nair', rating: 4, text: 'Great instructor; very encouraging.' }
    ],
    specialties: ['Sculpture', 'Mixed Media', 'Clay Work'],
    students: 860,
  },
  {
    name: 'Karan Mehta',
    slug: 'karan-mehta',
    email: 'karan@example.com',
    password: 'password',
    category: 'Photographer',
    bio: 'Portrait and street photographer.',
    location: 'Delhi',
    imageUrl: 'https://source.unsplash.com/1200x900/?portrait&sig=41',
    thumbnailUrl: 'https://source.unsplash.com/400x300/?portrait&sig=41',
    pricePerHour: 950,
    featured: true,
    featuredOrder: 4,
    testimonials: [
      { name: 'Neha Iyer', rating: 5, text: 'Karan has a great eye for portrait lighting — highly recommended.', date: new Date() }
    ],
    specialties: ['Portrait Photography', 'Street Photography', 'Lighting'],
    experience: 7,
    students: 410,
  },
];

const seedAll = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI missing in .env');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB — seeding all data...');

    // Delete existing related data
    await Booking.deleteMany({});
    console.log('Deleted all bookings');
    await Workshop.deleteMany({});
    console.log('Deleted all workshops');
    await Artist.deleteMany({});
    console.log('Deleted all artists');

    // Create artists and sample workshops
    for (const art of artistsSeed) {
      // Resolve unsplash redirects to final images if necessary
      try {
        art.imageUrl = await resolveRedirect(art.imageUrl);
        art.thumbnailUrl = await resolveRedirect(art.thumbnailUrl);
      } catch (err) {
        console.warn('Could not resolve image urls for', art.name, err.message);
      }

      const created = await Artist.create(art);
      console.log('Created artist:', created.name);

      // Create 1-2 sample workshops for each artist
      const w1 = await Workshop.create({
        title: `${created.name} — Introduction to ${created.category}`,
        artist: created._id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '10:00 AM - 12:00 PM',
        duration: '2 hours',
        enrolled: Math.floor((created.students || 20) * 0.15) + 5, // sample enrolled
        price: Math.round((created.pricePerHour || 500) * 0.8),
        mode: 'online',
        location: 'Zoom',
        description: `A beginner-friendly session by ${created.name}`,
      });
      console.log('  Created workshop:', w1.title);

      const w2 = await Workshop.create({
        title: `${created.name} — Advanced Techniques in ${created.category}`,
        artist: created._id,
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        time: '2:00 PM - 5:00 PM',
        duration: '3 hours',
        enrolled: Math.floor((created.students || 20) * 0.25) + 8,
        price: Math.round((created.pricePerHour || 700)),
        mode: 'offline',
        location: created.location,
        description: `An advanced hands-on workshop with ${created.name}`,
      });
      console.log('  Created workshop:', w2.title);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedAll();
