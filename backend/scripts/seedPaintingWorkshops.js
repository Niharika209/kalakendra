import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Workshop from '../models/Workshop.js';
import Artist from '../models/Artist.js';

dotenv.config();

const seedPaintingWorkshops = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Seeding 10 Painting Workshops (mostly OFFLINE)...');
    
    const artistSlugs = [
      'hradi-ni-parikh', 'noorjahan-artist', 'navya-paints',
      'priyanka-sharma-affectart', 'denger-art-teacher'
    ];
    
    const artists = await Artist.find({ slug: { $in: artistSlugs } });
    const artistMap = {};
    artists.forEach(artist => artistMap[artist.slug] = artist._id);
    
    console.log('Found artists:', Object.keys(artistMap));

    const workshops = [
      // HRADI NI PARIKH - 2 Workshops
      {
        title: "Procreate Character Design",
        description: "Create your first digital character using Procreate brushes and layers. iPad required. Beginner-friendly!",
        artist: artistMap['hradi-ni-parikh'],
        date: new Date('2025-12-14T14:00:00'),
        time: "2:00 PM - 4:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1200,
        maxParticipants: 10,
        mode: "online",
        coordinates: undefined,
        category: "Visual Arts",
        subcategory: "Digital Illustration",
        tags: ["procreate", "digital", "beginner"],
        targetAudience: "Beginners",
        materialProvided: false,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966213/kalakendra/artists/hardiniparikh.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764966213/kalakendra/artists/hardiniparikh.jpg",
        status: "active",
        seatsAvailable: 10
      },
      {
        title: "Digital Illustration Studio Session",
        description: "Hands-on Procreate workshop with live feedback. Bring your iPad and create portfolio-ready illustrations.",
        artist: artistMap['hradi-ni-parikh'],
        date: new Date('2025-12-20T11:00:00'),
        time: "11:00 AM - 1:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1500,
        maxParticipants: 8,
        mode: "offline",
        location: "Hradi Art Studio, Navrangpura, Ahmedabad",
        city: "Ahmedabad",
        locality: "Navrangpura",
        state: "Gujarat",
        coordinates: { type: 'Point', coordinates: [72.5714, 23.0225] },
        category: "Visual Arts",
        subcategory: "Digital Illustration",
        tags: ["intermediate", "studio", "portfolio"],
        targetAudience: "Intermediate",
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966213/kalakendra/artists/hardiniparikh.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764966213/kalakendra/artists/hardiniparikh.jpg",
        status: "active",
        seatsAvailable: 8
      },

      // NOORJAHAN - 2 Workshops
      {
        title: "Watercolor Flowers for Beginners",
        description: "Learn wet-on-wet watercolor techniques to paint beautiful flowers. No experience needed!",
        artist: artistMap['noorjahan-artist'],
        date: new Date('2025-12-15T10:00:00'),
        time: "10:00 AM - 12:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 900,
        maxParticipants: 15,
        mode: "offline",
        location: "Noorjahan Art Studio, Janakpuri, Delhi",
        city: "Delhi",
        locality: "Janakpuri",
        state: "Delhi",
        coordinates: { type: 'Point', coordinates: [77.1052, 28.6353] },
        category: "Visual Arts",
        subcategory: "Watercolor",
        tags: ["beginner", "flowers", "relaxing"],
        targetAudience: "Beginners",
        materialProvided: true,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966215/kalakendra/artists/noorjaahn.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764966215/kalakendra/artists/noorjaahn.jpg",
        status: "active",
        seatsAvailable: 15
      },
      {
        title: "Easy Sketching Animals",
        description: "Draw cute animals with simple pencil techniques. Perfect for kids and beginners.",
        artist: artistMap['noorjahan-artist'],
        date: new Date('2025-12-21T16:00:00'),
        time: "4:00 PM - 6:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 800,
        maxParticipants: 12,
        mode: "offline",
        location: "Noorjahan Art Studio, Janakpuri, Delhi",
        city: "Delhi",
        locality: "Janakpuri",
        state: "Delhi",
        coordinates: { type: 'Point', coordinates: [77.1052, 28.6353] },
        category: "Visual Arts",
        subcategory: "Sketching",
        tags: ["kids", "animals", "beginner"],
        targetAudience: "All Levels",
        materialProvided: true,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966215/kalakendra/artists/noorjaahn.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764966215/kalakendra/artists/noorjaahn.jpg",
        status: "active",
        seatsAvailable: 12
      },

      // NAVYA PAINTS - 2 Workshops
      {
        title: "Acrylic Landscape Painting",
        description: "Create a vibrant landscape on 16x20 canvas using acrylic techniques. All materials included.",
        artist: artistMap['navya-paints'],
        date: new Date('2025-12-16T14:00:00'),
        time: "2:00 PM - 4:30 PM",
        duration: "2.5 hours",
        durationMinutes: 150,
        price: 1300,
        maxParticipants: 10,
        mode: "offline",
        location: "Navya Art Studio, Indiranagar, Bengaluru",
        city: "Bengaluru",
        locality: "Indiranagar",
        state: "Karnataka",
        coordinates: { type: 'Point', coordinates: [77.6410, 12.9721] },
        category: "Visual Arts",
        subcategory: "Acrylic Painting",
        tags: ["landscape", "canvas", "take-home"],
        targetAudience: "Beginners",
        materialProvided: true,
        certificateProvided: true,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966217/kalakendra/artists/navyapaints.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764966217/kalakendra/artists/navyapaints.jpg",
        status: "active",
        seatsAvailable: 10
      },
      {
        title: "Modern Abstract Canvas",
        description: "Learn color theory and abstract techniques to create your own modern art piece.",
        artist: artistMap['navya-paints'],
        date: new Date('2025-12-22T11:00:00'),
        time: "11:00 AM - 1:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1100,
        maxParticipants: 12,
        mode: "offline",
        location: "Navya Art Studio, Indiranagar, Bengaluru",
        city: "Bengaluru",
        locality: "Indiranagar",
        state: "Karnataka",
        coordinates: { type: 'Point', coordinates: [77.6410, 12.9721] },
        category: "Visual Arts",
        subcategory: "Acrylic Painting",
        tags: ["abstract", "modern", "color-theory"],
        targetAudience: "All Levels",
        materialProvided: true,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966217/kalakendra/artists/navyapaints.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764966217/kalakendra/artists/navyapaints.jpg",
        status: "active",
        seatsAvailable: 12
      },

      // PRIYANKA SHARMA - 2 Workshops
      {
        title: "Abstract Texture Painting",
        description: "Experiment with palette knives, textures and bold colors to create dramatic abstract art.",
        artist: artistMap['priyanka-sharma-affectart'],
        date: new Date('2025-12-13T15:00:00'),
        time: "3:00 PM - 5:30 PM",
        duration: "2.5 hours",
        durationMinutes: 150,
        price: 1600,
        maxParticipants: 8,
        mode: "offline",
        location: "Affect Art Studio, Bandra West, Mumbai",
        city: "Mumbai",
        locality: "Bandra West",
        state: "Maharashtra",
        coordinates: { type: 'Point', coordinates: [72.8350, 19.0770] },
        category: "Visual Arts",
        subcategory: "Abstract Painting",
        tags: ["texture", "advanced", "expressive"],
        targetAudience: "Intermediate",
        materialProvided: true,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966218/kalakendra/artists/priyankasharma-affectart.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764966218/kalakendra/artists/priyankasharma-affectart.jpg",
        status: "active",
        seatsAvailable: 8
      },
      {
        title: "Mixed Media Collage",
        description: "Combine acrylics, paper, fabric and found objects to create unique mixed media artwork.",
        artist: artistMap['priyanka-sharma-affectart'],
        date: new Date('2025-12-19T18:00:00'),
        time: "6:00 PM - 8:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1400,
        maxParticipants: 10,
        mode: "offline",
        location: "Affect Art Studio, Bandra West, Mumbai",
        city: "Mumbai",
        locality: "Bandra West",
        state: "Maharashtra",
        coordinates: { type: 'Point', coordinates: [72.8350, 19.0770] },
        category: "Visual Arts",
        subcategory: "Mixed Media",
        tags: ["collage", "experimental", "materials"],
        targetAudience: "All Levels",
        materialProvided: true,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966218/kalakendra/artists/priyankasharma-affectart.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764966218/kalakendra/artists/priyankasharma-affectart.jpg",
        status: "active",
        seatsAvailable: 10
      },

      // DENGER ART TEACHER - 2 Workshops
      {
        title: "Realistic Portrait Drawing",
        description: "Learn proportions, shading and features to draw lifelike portraits in pencil.",
        artist: artistMap['denger-art-teacher'],
        date: new Date('2025-12-17T10:00:00'),
        time: "10:00 AM - 12:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1100,
        maxParticipants: 12,
        mode: "offline",
        location: "Denger Art Studio, Rohini, Delhi",
        city: "Delhi",
        locality: "Rohini",
        state: "Delhi",
        coordinates: { type: 'Point', coordinates: [77.0721, 28.7530] },
        category: "Visual Arts",
        subcategory: "Portrait Drawing",
        tags: ["portrait", "realism", "pencil"],
        targetAudience: "Intermediate",
        materialProvided: true,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966219/kalakendra/artists/dnegerart.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764966219/kalakendra/artists/dnegerart.jpg",
        status: "active",
        seatsAvailable: 12
      },
      {
        title: "Pencil Sketching Essentials",
        description: "Master shading, textures and composition with basic pencil techniques. Take home 3 finished sketches!",
        artist: artistMap['denger-art-teacher'],
        date: new Date('2025-12-21T14:00:00'),
        time: "2:00 PM - 4:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 900,
        maxParticipants: 15,
        mode: "offline",
        location: "Denger Art Studio, Rohini, Delhi",
        city: "Delhi",
        locality: "Rohini",
        state: "Delhi",
        coordinates: { type: 'Point', coordinates: [77.0721, 28.7530] },
        category: "Visual Arts",
        subcategory: "Sketching",
        tags: ["beginner", "pencil", "essentials"],
        targetAudience: "Beginners",
        materialProvided: true,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764966219/kalakendra/artists/dnegerart.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764966219/kalakendra/artists/dnegerart.jpg",
        status: "active",
        seatsAvailable: 15
      }
    ];

    await Workshop.deleteMany({ category: 'Visual Arts' });
    const insertedWorkshops = await Workshop.insertMany(workshops);
    console.log(`✅ ${insertedWorkshops.length} Painting Workshops seeded! (9 offline, 1 online)`);
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    mongoose.connection.close();
  }
};

seedPaintingWorkshops();
