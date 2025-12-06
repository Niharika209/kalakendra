import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Artist from '../models/Artist.js';
import bcrypt from 'bcrypt';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Seeding 5 REAL Dance Teachers...');
  
  const hashedPassword = await bcrypt.hash('dance123', 10);
  
  const realDanceTeachers = [
    // 1. Mukta Nagpal - Contemporary Dance [web:56]
    {
      name: "Mukta Nagpal",
      slug: "mukta-nagpal",
      email: "mukta.nagpal@kalakendra.in",
      password: hashedPassword,
      category: "Dance",
      subcategories: ["Contemporary", "Bollywood", "Movement"],
      specialization: "Contemporary Dance Instructor",
      bio: "Big Dance Centre faculty offering pop-up workshops in Delhi & Mumbai. Specializes in fluid contemporary techniques and expressive movement for all levels.",
      location: "Delhi / Mumbai",
      city: "Delhi",
      locality: "Saket",
      state: "Delhi",
      country: "India",
      coordinates: { type: 'Point', coordinates: [77.2521, 28.5211] },
      pricePerHour: 1200,
      experienceYears: 8,
      availabilitySettings: {
        isAvailable: true,
        modes: ['online', 'studio', 'both'],
        daysAvailable: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
        nextAvailableDate: new Date('2025-12-07')
      },
      featured: true,
      featuredOrder: 1,
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963240/kalakendra/artists/mukta-nagpal.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill,g_face/v1764963240/kalakendra/artists/mukta-nagpal.jpg",
      gallery: [],
      rating: 4.7,
      reviewsCount: 23,
      totalBookings: 67,
      responseRate: 92,
      specialties: ["Contemporary Dance", "Workshop Series", "Beginner Friendly"]
    },

    // 2. Ash Rao - Movement/Choreography [web:56]
    {
      name: "Ash Rao",
      slug: "ash-rao",
      email: "ash.rao@kalakendra.in",
      password: hashedPassword,
      category: "Dance",
      subcategories: ["Contemporary", "Choreography", "Hip-Hop"],
      specialization: "Movement Specialist",
      bio: "Delhi-based choreographer with Big Dance Centre. Teaches dynamic movement classes blending contemporary, hip-hop and choreography for performers.",
      location: "New Delhi",
      city: "Delhi",
      locality: "Greater Kailash",
      state: "Delhi",
      country: "India",
      coordinates: { type: 'Point', coordinates: [77.2350, 28.5620] },
      pricePerHour: 1000,
      experienceYears: 6,
      availabilitySettings: {
        isAvailable: true,
        modes: ['online', 'both'],
        daysAvailable: ['Tuesday', 'Thursday', 'Saturday'],
        nextAvailableDate: new Date('2025-12-08')
      },
      featured: true,
      featuredOrder: 2,
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963242/kalakendra/artists/ash-rao.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill,g_face/v1764963242/kalakendra/artists/ash-rao.jpg",
      gallery: [],
      rating: 4.6,
      reviewsCount: 18,
      totalBookings: 45,
      responseRate: 89,
      specialties: ["Movement Training", "Choreography", "Hip-Hop Fusion"]
    },

    // 3. Yoshetaa - Bollywood Expert [web:57]
    {
      name: "Yoshetaa",
      slug: "yoshetaa",
      email: "yoshetaa@kalakendra.in",
      password: hashedPassword,
      category: "Dance",
      subcategories: ["Bollywood", "Choreography", "Fitness Dance"],
      specialization: "Bollywood Dance Coach",
      bio: "Mumbai Tardeo studio owner teaching online & offline Bollywood routines. Known for easy-to-learn choreography perfect for social media reels.",
      location: "Mumbai, Tardeo",
      city: "Mumbai",
      locality: "Tardeo",
      state: "Maharashtra",
      country: "India",
      coordinates: { type: 'Point', coordinates: [72.8195, 19.1533] },
      pricePerHour: 900,
      experienceYears: 5,
      availabilitySettings: {
        isAvailable: true,
        modes: ['online', 'studio'],
        daysAvailable: ['Monday', 'Tuesday', 'Thursday', 'Sunday'],
        nextAvailableDate: new Date('2025-12-07')
      },
      featured: true,
      featuredOrder: 3,
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963243/kalakendra/artists/yoshetaa.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill,g_face/v1764963243/kalakendra/artists/yoshetaa.jpg",
      gallery: [],
      rating: 4.8,
      reviewsCount: 31,
      totalBookings: 89,
      responseRate: 95,
      specialties: ["Bollywood Reels", "Easy Choreography", "Group Classes"]
    },

    // 4. Tejal Pimpley - Bhangra/Bollywood [web:64]
    {
      name: "Tejal Pimpley",
      slug: "tejal-pimpley",
      email: "tejal.pimpley@kalakendra.in",
      password: hashedPassword,
      category: "Dance",
      subcategories: ["Bhangra", "Bollywood", "Fitness"],
      specialization: "Bhangra & Bollywood Trainer",
      bio: "B YOU studio founder in Mumbai teaching high-energy Bhangra and Bollywood fitness classes. Perfect for beginners wanting fun workout dance sessions.",
      location: "Mumbai",
      city: "Mumbai",
      locality: "Bandra West",
      state: "Maharashtra",
      country: "India",
      coordinates: { type: 'Point', coordinates: [72.8350, 19.0770] },
      pricePerHour: 1100,
      experienceYears: 7,
      availabilitySettings: {
        isAvailable: true,
        modes: ['studio', 'both'],
        daysAvailable: ['Wednesday', 'Friday', 'Saturday'],
        nextAvailableDate: new Date('2025-12-09')
      },
      featured: true,
      featuredOrder: 4,
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963244/kalakendra/artists/tejal-pimpley.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill,g_face/v1764963244/kalakendra/artists/tejal-pimpley.jpg",
      gallery: [],
      rating: 4.7,
      reviewsCount: 27,
      totalBookings: 72,
      responseRate: 93,
      specialties: ["Bhangra Fitness", "Bollywood Workout", "Group Sessions"]
    },

    // 5. Team Naach Lead Instructor [web:58]
    {
      name: "Priya Sharma (Team Naach)",
      slug: "priya-sharma-teamnaach",
      email: "priya.sharma@kalakendra.in",
      password: hashedPassword,
      category: "Dance",
      subcategories: ["Bollywood", "Fusion", "Wedding Choreo"],
      specialization: "Fusion Dance Expert",
      bio: "Lead instructor at Team Naach offering pan-India Bollywood fusion workshops and wedding choreography. Specializes in group performances and sangeet prep.",
      location: "Pan India",
      city: "Mumbai",
      locality: "Andheri West",
      state: "Maharashtra",
      country: "India",
      coordinates: { type: 'Point', coordinates: [72.8244, 19.1103] },
      pricePerHour: 1300,
      experienceYears: 9,
      availabilitySettings: {
        isAvailable: true,
        modes: ['online', 'both'],
        daysAvailable: ['Tuesday', 'Thursday', 'Friday', 'Sunday'],
        nextAvailableDate: new Date('2025-12-10')
      },
      featured: true,
      featuredOrder: 5,
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764964377/kalakendra/artists/priya-sharma-teamnaach.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill,g_face/v1764964377/kalakendra/artists/priya-sharma-teamnaach.jpg",
      gallery: [],
      rating: 4.9,
      reviewsCount: 42,
      totalBookings: 112,
      responseRate: 97,
      specialties: ["Wedding Choreography", "Bollywood Fusion", "Group Workshops"]
    }
  ];

  await Artist.deleteMany({ category: 'Dance' });
  const inserted = await Artist.insertMany(realDanceTeachers);
  console.log(`✅ ${inserted.length} REAL Dance Teachers seeded!`);
  
  mongoose.connection.close();
}).catch(err => {
  console.error('Error:', err);
  mongoose.connection.close();
});
