// seedDanceWorkshopsFixed.js - ONLY "online" & "offline" modes (10 Workshops)
// Run AFTER seeding artists: node seedDanceWorkshopsFixed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Workshop from '../models/Workshop.js';
import Artist from '../models/Artist.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Seeding 10 Dance Workshops (online/offline only)...');
  
  const artistSlugs = [
    'mukta-nagpal', 'ash-rao', 'yoshetaa', 
    'tejal-pimpley', 'priya-sharma-teamnaach'
  ];
  
  // Fetch artists first
  const artists = await Artist.find({ slug: { $in: artistSlugs } });
  const artistMap = {};
  artists.forEach(artist => artistMap[artist.slug] = artist._id);
  
  console.log('Found artists:', Object.keys(artistMap));
  
  const workshops = [
    // MUKTA NAGPAL - 2 Workshops
    {
      title: "Fluid Contemporary Flow Workshop",
      description: "Master contemporary dance techniques focusing on floorwork, partnering, and emotional expression. Perfect for intermediate dancers.",
      artist: artistMap['mukta-nagpal'],
      date: new Date('2025-12-14T10:00:00'),
      time: "10:00 AM - 12:00 PM",
      duration: "2 hours",
      durationMinutes: 120,
      price: 1800,
      maxParticipants: 12,
      mode: "offline",
      location: "Big Dance Centre, Saket, Delhi",
      city: "Delhi",
      locality: "Saket",
      state: "Delhi",
      coordinates: { type: 'Point', coordinates: [77.2521, 28.5211] },
      category: "Dance",
      subcategory: "Contemporary",
      tags: ["intermediate", "weekend", "group"],
      targetAudience: "Intermediate",
      materialProvided: false,
      certificateProvided: true,
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963240/kalakendra/artists/mukta-nagpal.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764963240/kalakendra/artists/mukta-nagpal.jpg",
      status: "active",
      seatsAvailable: 12
    },
    {
      title: "Bollywood Expression Masterclass",
      description: "Learn Mukta's signature Bollywood contemporary fusion with expressive hand gestures and dramatic storytelling.",
      artist: artistMap['mukta-nagpal'],
      date: new Date('2025-12-21T14:00:00'),
      time: "2:00 PM - 4:00 PM",
      duration: "2 hours",
      durationMinutes: 120,
      price: 1500,
      maxParticipants: 15,
      mode: "online",
      coordinates: undefined,
      category: "Dance",
      subcategory: "Bollywood",
      tags: ["beginner-friendly", "online", "reel-ready"],
      targetAudience: "Beginners",
      materialProvided: true,
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963240/kalakendra/artists/mukta-nagpal.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764963240/kalakendra/artists/mukta-nagpal.jpg",
      status: "active",
      seatsAvailable: 15
    },

    // ASH RAO - 2 Workshops
    {
      title: "Dynamic Movement Lab",
      description: "Explore Ash's unique movement vocabulary blending hip-hop, contemporary, and animal flow. High-energy class!",
      artist: artistMap['ash-rao'],
      date: new Date('2025-12-15T11:00:00'),
      time: "11:00 AM - 1:00 PM",
      duration: "2 hours",
      durationMinutes: 120,
      price: 1400,
      maxParticipants: 10,
      mode: "offline",
      location: "Big Dance Centre, Greater Kailash, Delhi",
      city: "Delhi",
      locality: "Greater Kailash",
      state: "Delhi",
      coordinates: { type: 'Point', coordinates: [77.2350, 28.5620] },
      category: "Dance",
      subcategory: "Contemporary",
      tags: ["advanced", "physical", "flow"],
      targetAudience: "Intermediate",
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963242/kalakendra/artists/ash-rao.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764963242/kalakendra/artists/ash-rao.jpg",
      status: "active",
      seatsAvailable: 10
    },
    {
      title: "Hip-Hop Choreo Breakdown",
      description: "Learn to break down complex hip-hop routines step-by-step. Perfect for dancers wanting sharp, clean moves.",
      artist: artistMap['ash-rao'],
      date: new Date('2025-12-20T16:00:00'),
      time: "4:00 PM - 6:00 PM",
      duration: "2 hours",
      durationMinutes: 120,
      price: 1200,
      maxParticipants: 14,
      mode: "online",
      coordinates: undefined,
      category: "Dance",
      subcategory: "Hip-Hop",
      tags: ["beginner", "online", "choreography"],
      targetAudience: "All Levels",
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963242/kalakendra/artists/ash-rao.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764963242/kalakendra/artists/ash-rao.jpg",
      status: "active",
      seatsAvailable: 14
    },

    // YOSHEETAA - 2 Workshops
    {
      title: "Reel-Ready Bollywood Routine",
      description: "Learn Yoshetta's viral Instagram reel choreography. Camera-ready moves perfect for social media!",
      artist: artistMap['yoshetaa'],
      date: new Date('2025-12-07T10:00:00'),
      time: "10:00 AM - 12:00 PM",
      duration: "2 hours",
      durationMinutes: 120,
      price: 1100,
      maxParticipants: 20,
      mode: "online",
      coordinates: undefined,
      category: "Dance",
      subcategory: "Bollywood",
      tags: ["beginner-friendly", "reel", "instagram"],
      targetAudience: "Beginners",
      materialProvided: true,
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963243/kalakendra/artists/yoshetaa.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764963243/kalakendra/artists/yoshetaa.jpg",
      status: "active",
      seatsAvailable: 18
    },
    {
      title: "Tardeo Studio Bollywood Class",
      description: "Live in-person Bollywood class at Yoshetta's Tardeo studio. High-energy group session with full choreography.",
      artist: artistMap['yoshetaa'],
      date: new Date('2025-12-13T15:00:00'),
      time: "3:00 PM - 5:00 PM",
      duration: "2 hours",
      durationMinutes: 120,
      price: 1300,
      maxParticipants: 15,
      mode: "offline",
      location: "Tardeo Dance Studio, Mumbai",
      city: "Mumbai",
      locality: "Tardeo",
      state: "Maharashtra",
      coordinates: { type: 'Point', coordinates: [72.8195, 19.1533] },
      category: "Dance",
      subcategory: "Bollywood",
      tags: ["group", "weekend", "live"],
      targetAudience: "All Levels",
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963243/kalakendra/artists/yoshetaa.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764963243/kalakendra/artists/yoshetaa.jpg",
      status: "active",
      seatsAvailable: 15
    },

    // TEJAL PIMPLEY - 2 Workshops
    {
      title: "High-Energy Bhangra Blast",
      description: "Tejal's signature Bhangra fitness workout! Burn calories while learning authentic Punjabi dance moves.",
      artist: artistMap['tejal-pimpley'],
      date: new Date('2025-12-16T18:00:00'),
      time: "6:00 PM - 8:00 PM",
      duration: "2 hours",
      durationMinutes: 120,
      price: 1200,
      maxParticipants: 18,
      mode: "offline",
      location: "B YOU Studio, Bandra West, Mumbai",
      city: "Mumbai",
      locality: "Bandra West",
      state: "Maharashtra",
      coordinates: { type: 'Point', coordinates: [72.8350, 19.0770] },
      category: "Dance",
      subcategory: "Bhangra",
      tags: ["fitness", "beginner", "fun"],
      targetAudience: "Beginners",
      materialProvided: true,
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963244/kalakendra/artists/tejal-pimpley.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764963244/kalakendra/artists/tejal-pimpley.jpg",
      status: "active",
      seatsAvailable: 18
    },
    {
      title: "Bollywood Fitness Fusion",
      description: "Combine Bollywood dance with cardio workout. Tejal's high-energy class for fitness enthusiasts!",
      artist: artistMap['tejal-pimpley'],
      date: new Date('2025-12-22T07:00:00'),
      time: "7:00 AM - 9:00 AM",
      duration: "2 hours",
      durationMinutes: 120,
      price: 1000,
      maxParticipants: 20,
      mode: "online",
      coordinates: undefined,
      category: "Dance",
      subcategory: "Fitness",
      tags: ["morning", "fitness", "online"],
      targetAudience: "All Levels",
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764963244/kalakendra/artists/tejal-pimpley.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764963244/kalakendra/artists/tejal-pimpley.jpg",
      status: "active",
      seatsAvailable: 20
    },

    // PRIYA SHARMA - 2 Workshops
    {
      title: "Wedding Sangeet Choreography",
      description: "Learn professional wedding choreography for sangeet performances. Perfect for brides, grooms & families!",
      artist: artistMap['priya-sharma-teamnaach'],
      date: new Date('2025-12-12T19:00:00'),
      time: "7:00 PM - 9:00 PM",
      duration: "2 hours",
      durationMinutes: 120,
      price: 1600,
      maxParticipants: 12,
      mode: "online",
      coordinates: undefined,
      category: "Dance",
      subcategory: "Wedding",
      tags: ["wedding", "sangeet", "family"],
      targetAudience: "All Levels",
      certificateProvided: true,
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764964377/kalakendra/artists/priya-sharma-teamnaach.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764964377/kalakendra/artists/priya-sharma-teamnaach.jpg",
      status: "active",
      seatsAvailable: 12
    },
    {
      title: "Bollywood Fusion Group Class",
      description: "Team Naach's signature fusion style combining Bollywood, contemporary & folk. Group performance ready!",
      artist: artistMap['priya-sharma-teamnaach'],
      date: new Date('2025-12-18T16:00:00'),
      time: "4:00 PM - 6:00 PM",
      duration: "2 hours",
      durationMinutes: 120,
      price: 1400,
      maxParticipants: 16,
      mode: "offline",
      location: "Team Naach Studio, Andheri West, Mumbai",
      city: "Mumbai",
      locality: "Andheri West",
      state: "Maharashtra",
      coordinates: { type: 'Point', coordinates: [72.8244, 19.1103] },
      category: "Dance",
      subcategory: "Fusion",
      tags: ["group", "performance", "intermediate"],
      targetAudience: "Intermediate",
      imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764964377/kalakendra/artists/priya-sharma-teamnaach.jpg",
      thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764964377/kalakendra/artists/priya-sharma-teamnaach.jpg",
      status: "active",
      seatsAvailable: 16
    }
  ];

  await Workshop.deleteMany({ category: 'Dance' });
  const insertedWorkshops = await Workshop.insertMany(workshops);
  console.log(`✅ ${insertedWorkshops.length} Dance Workshops seeded! (online/offline only)`);
  
  mongoose.connection.close();
}).catch(err => {
  console.error('Error:', err);
  mongoose.connection.close();
});
