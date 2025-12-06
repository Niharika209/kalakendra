import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Workshop from '../models/Workshop.js';
import Artist from '../models/Artist.js';

dotenv.config();

const seedMusicWorkshops = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Seeding 10 Music Workshops (mostly OFFLINE)...');
    
    const artistSlugs = [
      'abhishek-vijay-praghane', 'ranjith-govind', 'sneha-kapoor-angels',
      'amit-desai-musicroom', 'rachel-dsouza-shiamak'
    ];
    
    const artists = await Artist.find({ slug: { $in: artistSlugs } });
    const artistMap = {};
    artists.forEach(artist => artistMap[artist.slug] = artist._id);
    
    console.log('Found artists:', Object.keys(artistMap));

    const workshops = [
      // ABHISHEK VIJAY PRAGHANE - 2 Workshops
      {
        title: "Bollywood Playback Riyaz",
        description: "Master Bollywood singing techniques with proper riyaz, sur and taal. Perfect for aspiring playback singers.",
        artist: artistMap['abhishek-vijay-praghane'],
        date: new Date('2025-12-14T11:00:00'),
        time: "11:00 AM - 1:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1500,
        maxParticipants: 8,
        mode: "offline",
        location: "Musicriyaaz Studio, Andheri East, Mumbai",
        city: "Mumbai",
        locality: "Andheri East",
        state: "Maharashtra",
        coordinates: { type: 'Point', coordinates: [72.8589, 19.1141] },
        category: "Music",
        subcategory: "Vocal Training",
        tags: ["bollywood", "riyaz", "intermediate"],
        targetAudience: "Intermediate",
        materialProvided: true,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965509/kalakendra/artists/abhishekvijay.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764965509/kalakendra/artists/abhishekvijay.jpg",
        status: "active",
        seatsAvailable: 8
      },
      {
        title: "Online Vocal Warmup Masterclass",
        description: "Quick 90-min vocal warmup techniques for daily practice. Perfect for busy singers.",
        artist: artistMap['abhishek-vijay-praghane'],
        date: new Date('2025-12-18T19:00:00'),
        time: "7:00 PM - 8:30 PM",
        duration: "1.5 hours",
        durationMinutes: 90,
        price: 800,
        maxParticipants: 15,
        mode: "online",
        coordinates: undefined,
        category: "Music",
        subcategory: "Vocal Training",
        tags: ["beginner", "online", "quick"],
        targetAudience: "Beginners",
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965509/kalakendra/artists/abhishekvijay.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764965509/kalakendra/artists/abhishekvijay.jpg",
        status: "active",
        seatsAvailable: 15
      },

      // RANJITH GOVIND - 2 Workshops
      {
        title: "Carnatic Group Singing Circle",
        description: "Learn Carnatic kritis in group setting. Perfect for beginners wanting community singing experience.",
        artist: artistMap['ranjith-govind'],
        date: new Date('2025-12-15T10:00:00'),
        time: "10:00 AM - 12:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1200,
        maxParticipants: 12,
        mode: "offline",
        location: "PaatuClass Studio, T Nagar, Chennai",
        city: "Chennai",
        locality: "T Nagar",
        state: "Tamil Nadu",
        coordinates: { type: 'Point', coordinates: [80.2307, 13.0429] },
        category: "Music",
        subcategory: "Carnatic Music",
        tags: ["group", "beginner", "community"],
        targetAudience: "Beginners",
        certificateProvided: true,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965510/kalakendra/artists/ranjithgovind.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764965510/kalakendra/artists/ranjithgovind.jpg",
        status: "active",
        seatsAvailable: 12
      },
      {
        title: "Advanced Carnatic Ragas",
        description: "Deep dive into complex Carnatic ragas with live accompaniment. For serious learners.",
        artist: artistMap['ranjith-govind'],
        date: new Date('2025-12-21T15:00:00'),
        time: "3:00 PM - 5:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1800,
        maxParticipants: 6,
        mode: "offline",
        location: "PaatuClass Studio, T Nagar, Chennai",
        city: "Chennai",
        locality: "T Nagar",
        state: "Tamil Nadu",
        coordinates: { type: 'Point', coordinates: [80.2307, 13.0429] },
        category: "Music",
        subcategory: "Carnatic Music",
        tags: ["advanced", "raga", "live-music"],
        targetAudience: "Advanced",
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965510/kalakendra/artists/ranjithgovind.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764965510/kalakendra/artists/ranjithgovind.jpg",
        status: "active",
        seatsAvailable: 6
      },

      // SNEHA KAPOOR - 2 Workshops
      {
        title: "Kids Guitar & Vocal Combo",
        description: "Fun music class for kids combining basic guitar chords and simple songs. Parent-child friendly!",
        artist: artistMap['sneha-kapoor-angels'],
        date: new Date('2025-12-16T16:00:00'),
        time: "4:00 PM - 6:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1000,
        maxParticipants: 10,
        mode: "offline",
        location: "Angels Music Academy, Dwarka, Delhi",
        city: "Delhi",
        locality: "Dwarka",
        state: "Delhi",
        coordinates: { type: 'Point', coordinates: [77.0915, 28.6023] },
        category: "Music",
        subcategory: "Guitar",
        tags: ["kids", "guitar", "family"],
        targetAudience: "Beginners",
        materialProvided: true,
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965512/kalakendra/artists/snehakapoor.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764965512/kalakendra/artists/snehakapoor.jpg",
        status: "active",
        seatsAvailable: 10
      },
      {
        title: "Beginner Keyboard Workshop",
        description: "Learn basic keyboard chords and popular songs in 2 hours. No prior experience needed!",
        artist: artistMap['sneha-kapoor-angels'],
        date: new Date('2025-12-20T11:00:00'),
        time: "11:00 AM - 1:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 900,
        maxParticipants: 12,
        mode: "offline",
        location: "Angels Music Academy, Dwarka, Delhi",
        city: "Delhi",
        locality: "Dwarka",
        state: "Delhi",
        coordinates: { type: 'Point', coordinates: [77.0915, 28.6023] },
        category: "Music",
        subcategory: "Keyboard",
        tags: ["beginner", "keyboard", "quick-learn"],
        targetAudience: "Beginners",
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965512/kalakendra/artists/snehakapoor.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764965512/kalakendra/artists/snehakapoor.jpg",
        status: "active",
        seatsAvailable: 12
      },

      // AMIT DESAI - 2 Workshops
      {
        title: "Hindustani Raga Exploration",
        description: "Learn 3 popular Hindustani ragas with alap, jor and basic bandish. Live tanpura accompaniment.",
        artist: artistMap['amit-desai-musicroom'],
        date: new Date('2025-12-13T10:00:00'),
        time: "10:00 AM - 12:30 PM",
        duration: "2.5 hours",
        durationMinutes: 150,
        price: 2000,
        maxParticipants: 8,
        mode: "offline",
        location: "The Music Room, Bandra West, Mumbai",
        city: "Mumbai",
        locality: "Bandra West",
        state: "Maharashtra",
        coordinates: { type: 'Point', coordinates: [72.8350, 19.0770] },
        category: "Music",
        subcategory: "Hindustani Vocal",
        tags: ["classical", "raga", "advanced"],
        targetAudience: "Intermediate",
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965513/kalakendra/artists/amitdesai.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764965513/kalakendra/artists/amitdesai.jpg",
        status: "active",
        seatsAvailable: 8
      },
      {
        title: "Classical Vocal Foundations",
        description: "Perfect for beginners - learn swaras, basic aakaars and simple bandishes in Hindustani style.",
        artist: artistMap['amit-desai-musicroom'],
        date: new Date('2025-12-19T18:00:00'),
        time: "6:00 PM - 8:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1400,
        maxParticipants: 10,
        mode: "offline",
        location: "The Music Room, Bandra West, Mumbai",
        city: "Mumbai",
        locality: "Bandra West",
        state: "Maharashtra",
        coordinates: { type: 'Point', coordinates: [72.8350, 19.0770] },
        category: "Music",
        subcategory: "Hindustani Vocal",
        tags: ["beginner", "foundations", "classical"],
        targetAudience: "Beginners",
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965513/kalakendra/artists/amitdesai.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764965513/kalakendra/artists/amitdesai.jpg",
        status: "active",
        seatsAvailable: 10
      },

      // RACHEL D'SOUZA - 2 Workshops
      {
        title: "Western Pop Performance",
        description: "Stage-ready pop singing techniques + performance coaching. Microphone handling included!",
        artist: artistMap['rachel-dsouza-shiamak'],
        date: new Date('2025-12-17T19:00:00'),
        time: "7:00 PM - 9:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1600,
        maxParticipants: 10,
        mode: "offline",
        location: "Shiamak Studio, Lower Parel, Mumbai",
        city: "Mumbai",
        locality: "Lower Parel",
        state: "Maharashtra",
        coordinates: { type: 'Point', coordinates: [72.8293, 19.0728] },
        category: "Music",
        subcategory: "Western Vocals",
        tags: ["performance", "pop", "stage"],
        targetAudience: "Intermediate",
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965514/kalakendra/artists/racheldsouza.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764965514/kalakendra/artists/racheldsouza.jpg",
        status: "active",
        seatsAvailable: 10
      },
      {
        title: "Pop Vocal Technique Crash Course",
        description: "2-hour intensive on pop vocal runs, belting and contemporary techniques.",
        artist: artistMap['rachel-dsouza-shiamak'],
        date: new Date('2025-12-22T14:00:00'),
        time: "2:00 PM - 4:00 PM",
        duration: "2 hours",
        durationMinutes: 120,
        price: 1300,
        maxParticipants: 12,
        mode: "offline",
        location: "Shiamak Studio, Lower Parel, Mumbai",
        city: "Mumbai",
        locality: "Lower Parel",
        state: "Maharashtra",
        coordinates: { type: 'Point', coordinates: [72.8293, 19.0728] },
        category: "Music",
        subcategory: "Western Vocals",
        tags: ["intensive", "technique", "pop"],
        targetAudience: "All Levels",
        imageUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/v1764965514/kalakendra/artists/racheldsouza.jpg",
        thumbnailUrl: "https://res.cloudinary.com/dpa6uiwjm/image/upload/w_300,h_200,c_fill/v1764965514/kalakendra/artists/racheldsouza.jpg",
        status: "active",
        seatsAvailable: 12
      }
    ];

    await Workshop.deleteMany({ category: 'Music' });
    const insertedWorkshops = await Workshop.insertMany(workshops);
    console.log(`✅ ${insertedWorkshops.length} Music Workshops seeded! (9 offline, 1 online)`);
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err);
    mongoose.connection.close();
  }
};

seedMusicWorkshops();
