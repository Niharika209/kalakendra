import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Artist from '../models/Artist.js';
import bcrypt from 'bcrypt';

dotenv.config();

const seedPaintingTeachers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Seeding 5 REAL Painting Teachers...');
    
    const hashedPassword = await bcrypt.hash('paint123', 10);
    
    const realPaintingTeachers = [
      // 1. Hradi Ni Parikh - Procreate/Illustration
      {
        name: "Hradi Ni Parikh",
        slug: "hradi-ni-parikh",
        email: "hradi.parikh@kalakendra.in",
        password: hashedPassword,
        category: "Visual Arts",
        subcategories: ["Digital Illustration", "Procreate", "Character Design"],
        specialization: "Digital Art Instructor",
        bio: "47K+ Instagram illustrator teaching Procreate workshops and digital character design. Perfect for beginners transitioning to digital art.",
        location: "India / Online",
        city: "Ahmedabad",
        locality: "Navrangpura",
        state: "Gujarat",
        country: "India",
        coordinates: { type: 'Point', coordinates: [72.5714, 23.0225] },
        pricePerHour: 900,
        experienceYears: 6,
        availabilitySettings: {
          isAvailable: true,
          modes: ['online', 'both'],
          daysAvailable: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
          nextAvailableDate: new Date('2025-12-07')
        },
        demoSessionSettings: {
          enabled: true,
          duration: 45,
          price: 300,
          recurringSchedule: [
            { day: 'Friday', time: '18:00' },
            { day: 'Saturday', time: '11:00' }
          ]
        },
        featured: true,
        featuredOrder: 11,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966213/kalakendra/artists/hardiniparikh.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill/v1764966213/kalakendra/artists/hardiniparikh.jpg",
        gallery: [
          { url: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966213/kalakendra/artists/hardiniparikh.jpg", type: 'image' }
        ],
        rating: 4.8,
        reviewsCount: 56,
        totalBookings: 134,
        responseRate: 95,
        specialties: ["Procreate", "Digital Illustration", "Character Design"]
      },

      // 2. Noorjahan - Youngest Art Teacher
      {
        name: "Noorjahan",
        slug: "noorjahan-artist",
        email: "noorjahan@kalakendra.in",
        password: hashedPassword,
        category: "Visual Arts",
        subcategories: ["Watercolor", "Sketching", "Beginner Drawing"],
        specialization: "Beginner Art Coach",
        bio: "India's youngest art teacher (viral with Great Khali) offering simple watercolor and sketching classes for absolute beginners.",
        location: "Online / Delhi",
        city: "Delhi",
        locality: "Janakpuri",
        state: "Delhi",
        country: "India",
        coordinates: { type: 'Point', coordinates: [77.1052, 28.6353] },
        pricePerHour: 700,
        experienceYears: 4,
        availabilitySettings: {
          isAvailable: true,
          modes: ['online', 'studio'],
          daysAvailable: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
          nextAvailableDate: new Date('2025-12-08')
        },
        demoSessionSettings: {
          enabled: true,
          duration: 30,
          price: 200,
          recurringSchedule: [
            { day: 'Saturday', time: '16:00' },
            { day: 'Sunday', time: '10:00' }
          ]
        },
        featured: true,
        featuredOrder: 12,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966215/kalakendra/artists/noorjaahn.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill/v1764966215/kalakendra/artists/noorjaahn.jpg",
        gallery: [
          { url: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966215/kalakendra/artists/noorjaahn.jpg", type: 'image' }
        ],
        rating: 4.9,
        reviewsCount: 78,
        totalBookings: 201,
        responseRate: 98,
        specialties: ["Watercolor Basics", "Sketching", "Kids Art"]
      },

      // 3. Navya Paints - Skillshare Teacher
      {
        name: "Navya",
        slug: "navya-paints",
        email: "navya@kalakendra.in",
        password: hashedPassword,
        category: "Visual Arts",
        subcategories: ["Acrylic Painting", "Modern Art", "Canvas Art"],
        specialization: "Acrylic Painting Expert",
        bio: "Skillshare teacher and Instagram artist (1.9K followers) teaching acrylic painting techniques and modern canvas art.",
        location: "Online",
        city: "Bengaluru",
        locality: "Indiranagar",
        state: "Karnataka",
        country: "India",
        coordinates: { type: 'Point', coordinates: [77.6410, 12.9721] },
        pricePerHour: 850,
        experienceYears: 5,
        availabilitySettings: {
          isAvailable: true,
          modes: ['online', 'both'],
          daysAvailable: ['Monday', 'Wednesday', 'Friday'],
          nextAvailableDate: new Date('2025-12-09')
        },
        demoSessionSettings: {
          enabled: true,
          duration: 60,
          price: 350,
          recurringSchedule: [
            { day: 'Wednesday', time: '19:00' },
            { day: 'Friday', time: '19:00' }
          ]
        },
        featured: true,
        featuredOrder: 13,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966217/kalakendra/artists/navyapaints.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill/v1764966217/kalakendra/artists/navyapaints.jpg",
        gallery: [
          { url: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966217/kalakendra/artists/navyapaints.jpg", type: 'image' }
        ],
        rating: 4.7,
        reviewsCount: 34,
        totalBookings: 89,
        responseRate: 92,
        specialties: ["Acrylic Painting", "Canvas Art", "Modern Styles"]
      },

      // 4. Priyanka Sharma - Affect Art Teacher
      {
        name: "Priyanka Sharma",
        slug: "priyanka-sharma-affectart",
        email: "priyanka.sharma@kalakendra.in",
        password: hashedPassword,
        category: "Visual Arts",
        subcategories: ["Abstract Painting", "Mixed Media", "Texture Art"],
        specialization: "Abstract Art Workshop Leader",
        bio: "Affect Art studio lead teacher specializing in abstract painting and mixed media workshops in Mumbai.",
        location: "Mumbai",
        city: "Mumbai",
        locality: "Bandra West",
        state: "Maharashtra",
        country: "India",
        coordinates: { type: 'Point', coordinates: [72.8350, 19.0770] },
        pricePerHour: 1100,
        experienceYears: 8,
        availabilitySettings: {
          isAvailable: true,
          modes: ['studio', 'both'],
          daysAvailable: ['Tuesday', 'Thursday', 'Saturday'],
          nextAvailableDate: new Date('2025-12-10')
        },
        demoSessionSettings: {
          enabled: true,
          duration: 60,
          price: 400,
          recurringSchedule: [
            { day: 'Tuesday', time: '17:00' },
            { day: 'Saturday', time: '14:00' }
          ]
        },
        featured: true,
        featuredOrder: 14,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966218/kalakendra/artists/priyankasharma-affectart.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill/v1764966218/kalakendra/artists/priyankasharma-affectart.jpg",
        gallery: [
          { url: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966218/kalakendra/artists/priyankasharma-affectart.jpg", type: 'image' }
        ],
        rating: 4.6,
        reviewsCount: 27,
        totalBookings: 67,
        responseRate: 90,
        specialties: ["Abstract Art", "Mixed Media", "Texture Painting"]
      },

      // 5. Denger Art Teacher
      {
        name: "Denger Art Teacher",
        slug: "denger-art-teacher",
        email: "denger@kalakendra.in",
        password: hashedPassword,
        category: "Visual Arts",
        subcategories: ["Pencil Sketching", "Portrait Drawing", "Realism"],
        specialization: "Realism Drawing Coach",
        bio: "Viral art teacher offering pencil sketching and portrait drawing workshops. Specializes in realistic human portraits.",
        location: "Delhi NCR",
        city: "Delhi",
        locality: "Rohini",
        state: "Delhi",
        country: "India",
        coordinates: { type: 'Point', coordinates: [77.0721, 28.7530] },
        pricePerHour: 800,
        experienceYears: 5,
        availabilitySettings: {
          isAvailable: true,
          modes: ['online', 'studio'],
          daysAvailable: ['Wednesday', 'Friday', 'Saturday', 'Sunday'],
          nextAvailableDate: new Date('2025-12-11')
        },
        demoSessionSettings: {
          enabled: true,
          duration: 45,
          price: 250,
          recurringSchedule: [
            { day: 'Sunday', time: '15:00' },
            { day: 'Wednesday', time: '18:00' }
          ]
        },
        featured: true,
        featuredOrder: 15,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966219/kalakendra/artists/dnegerart.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill/v1764966219/kalakendra/artists/dnegerart.jpg",
        gallery: [
          { url: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966219/kalakendra/artists/dnegerart.jpg", type: 'image' }
        ],
        rating: 4.8,
        reviewsCount: 45,
        totalBookings: 112,
        responseRate: 94,
        specialties: ["Pencil Sketching", "Portrait Drawing", "Realism"]
      }
    ];

    await Artist.deleteMany({ category: 'Visual Arts' });
    const inserted = await Artist.insertMany(realPaintingTeachers);
    console.log(`✅ ${inserted.length} REAL Painting Teachers seeded!`);
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    mongoose.connection.close();
  }
};

seedPaintingTeachers();
