import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Artist from '../models/Artist.js';
import bcrypt from 'bcrypt';

dotenv.config();

const seedMusicTeachers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Seeding 5 REAL Music Teachers...');
    
    const hashedPassword = await bcrypt.hash('music123', 10);
    
    const realMusicTeachers = [
      // 1. Abhishek Vijay Praghane - Vocal Coach
      {
        name: "Abhishek Vijay Praghane",
        slug: "abhishek-vijay-praghane",
        email: "abhishek.praghane@kalakendra.in",
        password: hashedPassword,
        category: "Music",
        subcategories: ["Vocal Training", "Hindustani Classical", "Bollywood Singing"],
        specialization: "Professional Vocal Coach",
        bio: "Musicriyaaz founder offering online vocal training for beginners to advanced. Specializes in riyaz, sur and Bollywood playback techniques.",
        location: "Mumbai / Online",
        city: "Mumbai",
        locality: "Andheri East",
        state: "Maharashtra",
        country: "India",
        coordinates: { type: 'Point', coordinates: [72.8589, 19.1141] },
        pricePerHour: 1000,
        experienceYears: 10,
        availabilitySettings: {
          isAvailable: true,
          modes: ['online', 'both'],
          daysAvailable: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
          nextAvailableDate: new Date('2025-12-07')
        },
        demoSessionSettings: {
          enabled: true,
          duration: 30,
          price: 300,
          recurringSchedule: [
            { day: 'Monday', time: '18:00' },
            { day: 'Friday', time: '19:00' }
          ]
        },
        featured: true,
        featuredOrder: 6,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965509/kalakendra/artists/abhishekvijay.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill/v1764965509/kalakendra/artists/abhishekvijay.jpg",
        gallery: [
          { url: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965509/kalakendra/artists/abhishekvijay.jpg", type: 'image' }
        ],
        rating: 4.8,
        reviewsCount: 35,
        totalBookings: 89,
        responseRate: 94,
        specialties: ["Vocal Riyaz", "Bollywood Playback", "Online Lessons"]
      },

      // 2. Ranjith Govind - PaatuClass
      {
        name: "Ranjith Govind",
        slug: "ranjith-govind",
        email: "ranjith.govind@kalakendra.in",
        password: hashedPassword,
        category: "Music",
        subcategories: ["Vocal Training", "Carnatic Music", "Group Singing"],
        specialization: "PaatuClass Instructor",
        bio: "The Pallikoodam lead vocal coach teaching Carnatic music and group singing workshops across India. Perfect for beginners.",
        location: "Chennai / Pan India",
        city: "Chennai",
        locality: "T Nagar",
        state: "Tamil Nadu",
        country: "India",
        coordinates: { type: 'Point', coordinates: [80.2307, 13.0429] },
        pricePerHour: 900,
        experienceYears: 12,
        availabilitySettings: {
          isAvailable: true,
          modes: ['online', 'both'],
          daysAvailable: ['Tuesday', 'Thursday', 'Saturday', 'Sunday'],
          nextAvailableDate: new Date('2025-12-08')
        },
        demoSessionSettings: {
          enabled: true,
          duration: 30,
          price: 250,
          recurringSchedule: [
            { day: 'Saturday', time: '10:00' },
            { day: 'Sunday', time: '11:00' }
          ]
        },
        featured: true,
        featuredOrder: 7,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965510/kalakendra/artists/ranjithgovind.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill/v1764965510/kalakendra/artists/ranjithgovind.jpg",
        gallery: [
          { url: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965510/kalakendra/artists/ranjithgovind.jpg", type: 'image' }
        ],
        rating: 4.7,
        reviewsCount: 28,
        totalBookings: 65,
        responseRate: 91,
        specialties: ["Carnatic Music", "Group Singing", "Beginner Classes"]
      },

      // 3. Sneha Kapoor - Angels Music Academy
      {
        name: "Sneha Kapoor",
        slug: "sneha-kapoor-angels",
        email: "sneha.kapoor@kalakendra.in",
        password: hashedPassword,
        category: "Music",
        subcategories: ["Vocal Training", "Guitar", "Keyboard"],
        specialization: "Multi-Instrument Coach",
        bio: "Angels Music Academy lead teacher offering vocal, guitar and keyboard lessons for kids and adults. Personalized online classes.",
        location: "Delhi NCR / Online",
        city: "Delhi",
        locality: "Dwarka",
        state: "Delhi",
        country: "India",
        coordinates: { type: 'Point', coordinates: [77.0915, 28.6023] },
        pricePerHour: 800,
        experienceYears: 7,
        availabilitySettings: {
          isAvailable: true,
          modes: ['online', 'studio'],
          daysAvailable: ['Monday', 'Wednesday', 'Friday'],
          nextAvailableDate: new Date('2025-12-09')
        },
        demoSessionSettings: {
          enabled: true,
          duration: 45,
          price: 350,
          recurringSchedule: [
            { day: 'Wednesday', time: '16:00' },
            { day: 'Friday', time: '17:00' }
          ]
        },
        featured: true,
        featuredOrder: 8,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965512/kalakendra/artists/snehakapoor.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill/v1764965512/kalakendra/artists/snehakapoor.jpg",
        gallery: [
          { url: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965512/kalakendra/artists/snehakapoor.jpg", type: 'image' }
        ],
        rating: 4.6,
        reviewsCount: 22,
        totalBookings: 54,
        responseRate: 88,
        specialties: ["Kids Music", "Guitar Basics", "Keyboard Lessons"]
      },

      // 4. Amit Desai - The Music Room
      {
        name: "Amit Desai",
        slug: "amit-desai-musicroom",
        email: "amit.desai@kalakendra.in",
        password: hashedPassword,
        category: "Music",
        subcategories: ["Hindustani Vocal", "Indian Classical", "Raga Training"],
        specialization: "Classical Vocal Trainer",
        bio: "The Music Room senior vocal coach specializing in Hindustani classical music. Teaches ragas, taals and advanced vocal techniques.",
        location: "Mumbai",
        city: "Mumbai",
        locality: "Bandra West",
        state: "Maharashtra",
        country: "India",
        coordinates: { type: 'Point', coordinates: [72.8350, 19.0770] },
        pricePerHour: 1200,
        experienceYears: 15,
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
            { day: 'Tuesday', time: '15:00' },
            { day: 'Thursday', time: '15:00' }
          ]
        },
        featured: true,
        featuredOrder: 9,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965513/kalakendra/artists/amitdesai.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill/v1764965513/kalakendra/artists/amitdesai.jpg",
        gallery: [
          { url: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965513/kalakendra/artists/amitdesai.jpg", type: 'image' }
        ],
        rating: 4.9,
        reviewsCount: 41,
        totalBookings: 103,
        responseRate: 96,
        specialties: ["Hindustani Classical", "Raga Mastery", "Advanced Vocal"]
      },

      // 5. Rachel D'Souza - Shiamak Vocal Instructor
      {
        name: "Rachel D'Souza",
        slug: "rachel-dsouza-shiamak",
        email: "rachel.dsouza@kalakendra.in",
        password: hashedPassword,
        category: "Music",
        subcategories: ["Western Vocals", "Pop Singing", "Performance Coaching"],
        specialization: "Contemporary Vocal Coach",
        bio: "Shiamak India certified vocal trainer teaching western pop vocals, stage presence and performance techniques for modern singers.",
        location: "Mumbai / Delhi",
        city: "Mumbai",
        locality: "Lower Parel",
        state: "Maharashtra",
        country: "India",
        coordinates: { type: 'Point', coordinates: [72.8293, 19.0728] },
        pricePerHour: 1100,
        experienceYears: 9,
        availabilitySettings: {
          isAvailable: true,
          modes: ['online', 'both'],
          daysAvailable: ['Wednesday', 'Friday', 'Saturday', 'Sunday'],
          nextAvailableDate: new Date('2025-12-11')
        },
        demoSessionSettings: {
          enabled: true,
          duration: 45,
          price: 350,
          recurringSchedule: [
            { day: 'Saturday', time: '14:00' },
            { day: 'Sunday', time: '14:00' }
          ]
        },
        featured: true,
        featuredOrder: 10,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965514/kalakendra/artists/racheldsouza.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_200,h_200,c_fill/v1764965514/kalakendra/artists/racheldsouza.jpg",
        gallery: [
          { url: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965514/kalakendra/artists/racheldsouza.jpg", type: 'image' }
        ],
        rating: 4.7,
        reviewsCount: 29,
        totalBookings: 76,
        responseRate: 93,
        specialties: ["Western Pop", "Stage Performance", "Contemporary Vocals"]
      }
    ];

    // Delete existing music teachers and insert new ones
    await Artist.deleteMany({ category: 'Music' });
    const inserted = await Artist.insertMany(realMusicTeachers);
    console.log(`✅ ${inserted.length} REAL Music Teachers seeded!`);
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    mongoose.connection.close();
  }
};

seedMusicTeachers();
