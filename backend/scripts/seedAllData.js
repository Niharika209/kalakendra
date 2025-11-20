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
  // If path looks like a local project asset (starts with '/'), skip network resolution
  if (typeof url === 'string' && url.startsWith('/')) return url;
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
    about: 'Asha Patel is a contemporary painter specializing in portraiture and expressive figure work. She blends classical techniques with modern color theory to create emotionally resonant works. Asha runs regular workshops focused on composition, color mixing, and portrait lighting for both beginners and experienced artists.',
    location: 'Ahmedabad',
    // use Unsplash portrait queries (sig param gives stable different images)
    imageUrl: 'https://source.unsplash.com/1200x900/?portrait&sig=11',
    thumbnailUrl: 'https://source.unsplash.com/400x300/?portrait&sig=11',
    pricePerHour: 900,
    featured: true,
    featuredOrder: 1,
    specialties: ['painting', 'Portraits', 'Figure Painting', 'Oil', 'Watercolor', 'Acrylic'],
    experience: 6,
    students: 320,
    rating: 4.7,
    reviewsCount: 78,
    testimonials: [
      { name: 'Rina Patel', rating: 5, text: 'Asha helped me unlock color and composition in my portraits.', date: new Date() },
      { name: 'Sahil Mehra', rating: 4.5, text: 'Really great feedback and demos during the workshop.', date: new Date() }
    ],
    reviews: [
      { name: 'Rina Patel', rating: 5, text: 'Asha helped me unlock color and composition in my portraits.' },
      { name: 'Sahil Mehra', rating: 4.5, text: 'Very practical and hands-on.' }
    ],
    videos: [
      { title: 'Portrait Techniques with Asha', thumbnailUrl: 'https://source.unsplash.com/400x300/?portrait&sig=111', url: 'https://example.com/videos/asha-portrait.mp4', duration: '12:34', views: 2140 }
    ],
  },
  {
    name: 'Vikram Rao',
    slug: 'vikram-rao',
    email: 'vikram@example.com',
    password: 'password',
    category: 'Vocalist',
    bio: 'Vocal coach and performance artist.',
    about: 'Vikram Rao is a versatile vocalist and performance coach based in Mumbai. Trained in Hindustani classical traditions and contemporary performance, Vikram blends rigorous vocal technique with practical stage-craft. He has worked with theatre ensembles, playback artists and established a pedagogy focused on breath work, tonal control, and expressive interpretation. He runs group masterclasses, exam-prep courses and one-on-one coaching for audition and stage-ready performances.',
    location: 'Mumbai',
    imageUrl: 'https://source.unsplash.com/1200x900/?portrait&sig=21',
    thumbnailUrl: 'https://source.unsplash.com/400x300/?portrait&sig=21',
    pricePerHour: 1100,
    featured: true,
    featuredOrder: 2,
    specialties: [
      'Hindustani Classical',
      'Breath Control & Support',
      'Raga Theory',
      'Voice Conditioning',
      'Performance Coaching',
      'Playback Singing',
      'Stagecraft'
    ],
    experience: 12,
    students: 820,
    rating: 4.9,
    reviewsCount: 210,
    awards: [
      { title: 'Best Vocal Coach — Mumbai Arts Awards', year: 2020 },
      { title: 'Young Artist Fellowship', year: 2016 }
    ],
    certifications: ['Sangeet Visharad', 'Advanced Voice Pedagogy — RIM'],
    languages: ['English', 'Hindi', 'Marathi'],
    teachingApproach: 'I combine breath physiology, classical voice exercises and repertoire-driven coaching. Emphasis is on sustainable technique and stage readiness.',
    curriculum: [
      { module: 'Foundations', topics: ['Breathing', 'Posture', 'Basic Alankar'] },
      { module: 'Intermediate', topics: ['Raga Application', 'Expression', 'Micro-dynamics'] },
      { module: 'Performance Lab', topics: ['Stage Presence', 'Microphone Technique', 'Repertoire'] }
    ],
    testimonials: [
      { name: 'Neha Singh', rating: 5, text: 'Vikram transformed my breathing technique and performance confidence.', date: new Date('2023-07-12') },
      { name: 'Rohan Desai', rating: 5, text: 'Practical, patient and deeply knowledgeable — helped me prepare for auditions.', date: new Date('2022-11-05') }
    ],
    reviews: [
      { name: 'Neha Singh', rating: 5, text: 'Incredible teacher with patient guidance.' },
      { name: 'Rohan Desai', rating: 5, text: 'Helped me shape my vocal lines and presence.' }
    ],
    videos: [
      { title: 'Vocal Warmups with Vikram', thumbnailUrl: 'https://source.unsplash.com/400x300/?music&sig=21', url: 'https://example.com/videos/vikram-warmups.mp4', duration: '8:20', views: 3420 },
      { title: 'Breath Techniques for Singers', thumbnailUrl: 'https://source.unsplash.com/400x300/?breathing&sig=22', url: 'https://example.com/videos/vikram-breath.mp4', duration: '14:03', views: 2870 }
    ],
    social: { instagram: 'https://instagram.com/vikramrao', youtube: 'https://youtube.com/vikramrao' },
    contact: { phone: '+91-98765-43210', email: 'vikram@example.com' },
    availability: { weekdays: ['Mon', 'Wed', 'Sat'], times: '10:00-14:00' },
    studentsTaughtHighlights: ['National School of Music scholarship students', 'Playback audition coaching — multiple success stories'],
    reviewsExcerpt: 'Strong technical base with modern performance sensibilities.'
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
    specialties: [
      'Contemporary Sculpture',
      'Clay Modeling',
      'Ceramics',
      'Mixed Media',
      'Casting Techniques',
      '3D Composition',
      'Public Art'
    ],
    experience: 8,
    students: 980,
    rating: 4.85,
    reviewsCount: 124,
    awards: [
      { title: 'Emerging Sculptor Award', year: 2019 },
      { title: 'Public Art Residency — Bangalore', year: 2021 }
    ],
    residencies: ['Bangalore Public Art Residency 2021', 'Kerala Clay Residency 2018'],
    exhibitions: [
      { title: 'Material Narratives', year: 2022, venue: 'Bengaluru Arts Collective' },
      { title: 'Clay & Context', year: 2019, venue: 'Coastal Arts Gallery' }
    ],
    teachingApproach: 'Studio-first workshops that balance concept development, material exploration and technical mastery. Emphasis on individual expression within structured projects.',
    curriculum: [
      { module: 'Foundations', topics: ['Clay properties', 'Handbuilding basics', 'Tool use'] },
      { module: 'Material Experiments', topics: ['Mixed media integration', 'Surface treatments', 'Pigments'] },
      { module: 'Project Lab', topics: ['Concept development', 'Series work', 'Public installation basics'] }
    ],
    testimonials: [
      { name: 'Riya Sen', rating: 5, text: 'Amazing hands-on workshop — learned so much!', date: new Date('2024-02-21') },
      { name: 'Aman Gupta', rating: 4.5, text: 'Very patient and creative instructor.', date: new Date('2023-09-11') }
    ],
    reviews: [
      { name: 'Anil Sharma', rating: 5, text: 'Transformed my approach to clay and composition — highly recommend.' },
      { name: 'Priya Nair', rating: 4, text: 'Great instructor; very encouraging.' }
    ],
    videos: [
      { title: 'Workshop Highlights — Simran Kaur', thumbnailUrl: '/src/assets/profile.jpg', url: 'https://example.com/videos/simran-highlights.mp4', duration: '5:12', views: 1240 },
      { title: 'Studio Tour with Simran', thumbnailUrl: '/src/assets/profile.jpg', url: 'https://example.com/videos/simran-studio.mp4', duration: '3:45', views: 860 },
      { title: 'Clay Surface Techniques', thumbnailUrl: '/src/assets/profile.jpg', url: 'https://example.com/videos/simran-surface.mp4', duration: '9:20', views: 670 }
    ],
    social: { instagram: 'https://instagram.com/simrankaur', website: 'https://simrankaur.art' },
    contact: { email: 'simran@example.com' },
    classSize: { typical: 12, max: 20 },
    materialsProvided: ['Tools', 'Glaze for firing (optional)'],
    studentsTaughtHighlights: ['Community ceramics program lead', 'Several students exhibiting in regional shows']
  },
  {
    name: 'Karan Mehta',
    slug: 'karan-mehta',
    email: 'karan@example.com',
    password: 'password',
    category: 'Photographer',
    bio: 'Portrait and street photographer.',
    about: 'Karan Mehta is a Delhi-based portrait and street photographer who focuses on natural light and candid storytelling. He teaches composition, editing workflows, and camera techniques tailored for portrait and documentary styles.',
    location: 'Delhi',
    imageUrl: 'https://source.unsplash.com/1200x900/?portrait&sig=41',
    thumbnailUrl: 'https://source.unsplash.com/400x300/?portrait&sig=41',
    pricePerHour: 950,
    featured: true,
    featuredOrder: 4,
    testimonials: [
      { name: 'Neha Iyer', rating: 5, text: 'Karan has a great eye for portrait lighting — highly recommended.', date: new Date() }
    ],
    specialties: ['photography', 'Portrait Photography', 'Street Photography', 'Lighting'],
    experience: 7,
    students: 410,
    rating: 4.6,
    reviewsCount: 64,
    reviews: [
      { name: 'Neha Iyer', rating: 5, text: 'Excellent mentoring on portrait lighting and direction.' }
    ],
    videos: [
      { title: 'Street Photography Tips', thumbnailUrl: 'https://source.unsplash.com/400x300/?street&sig=41', url: 'https://example.com/videos/karan-street.mp4', duration: '6:10', views: 980 }
    ],
  },
  {
    name: 'Maya Reddy',
    slug: 'maya-reddy',
    email: 'maya@example.com',
    password: 'password',
    category: 'Dancer',
    bio: 'Contemporary and classical Bharatanatyam performer and teacher.',
    about: 'Maya Reddy blends classical Bharatanatyam training with contemporary choreography. Based in Chennai, she has performed nationally and internationally and leads regular group workshops focusing on rhythm, expression and choreography for stage performances.',
    location: 'Chennai',
    imageUrl: 'https://source.unsplash.com/1200x900/?dance,performer&sig=51',
    thumbnailUrl: 'https://source.unsplash.com/400x300/?dance,performer&sig=51',
    pricePerHour: 1300,
    featured: false,
    specialties: ['Bharatanatyam', 'Contemporary Dance', 'Choreography', 'Abhinaya', 'Rhythm'],
    experience: 9,
    students: 420,
    rating: 4.8,
    reviewsCount: 92,
    testimonials: [
      { name: 'Sakshi Rao', rating: 5, text: 'Maya is an inspiring teacher — her choreography and attention to expression are exceptional.', date: new Date('2023-06-10') }
    ],
    reviews: [
      { name: 'Sakshi Rao', rating: 5, text: 'Fantastic instructor for both technique and stage presence.' }
    ],
    videos: [
      { title: 'Contemporary Bharatanatyam — Maya Reddy', thumbnailUrl: 'https://source.unsplash.com/400x300/?dance&sig=52', url: 'https://example.com/videos/maya-performance.mp4', duration: '7:22', views: 1540 }
    ]
  },
  {
    name: 'Arjun Singh',
    slug: 'arjun-singh',
    email: 'arjun@example.com',
    password: 'password',
    category: 'Painter',
    bio: 'Contemporary landscape and mixed-media painter.',
    about: 'Arjun Singh works with layered mixed-media techniques to explore urban landscapes and memory. He runs intensive weekend painting workshops that emphasize composition, texture and mixed media processes.',
    location: 'Jaipur',
    imageUrl: 'https://source.unsplash.com/1200x900/?painting,landscape&sig=61',
    thumbnailUrl: 'https://source.unsplash.com/400x300/?painting,landscape&sig=61',
    pricePerHour: 850,
    featured: false,
    specialties: ['Landscape', 'Mixed Media', 'Texture', 'Acrylic', 'Urban Sketching'],
    experience: 7,
    students: 210,
    rating: 4.6,
    reviewsCount: 48,
    testimonials: [
      { name: 'Meeta Joshi', rating: 5, text: 'Arjun helped me find textures I never thought to use — very hands-on.', date: new Date('2022-10-04') }
    ],
    reviews: [
      { name: 'Meeta Joshi', rating: 5, text: 'Excellent practical demos and studio feedback.' }
    ],
    videos: [
      { title: 'Mixed Media Textures with Arjun', thumbnailUrl: 'https://source.unsplash.com/400x300/?art&sig=62', url: 'https://example.com/videos/arjun-texture.mp4', duration: '10:00', views: 720 }
    ]
  },
  {
    name: 'Neelam Joshi',
    slug: 'neelam-joshi',
    email: 'neelam@example.com',
    password: 'password',
    category: 'Photographer',
    bio: 'Documentary and street photographer focusing on everyday life.',
    about: 'Neelam Joshi documents city life through a compassionate lens. She runs hands-on street photography walks and editing workshops that focus on narrative, candid shooting and ethical storytelling.',
    location: 'Kolkata',
    imageUrl: 'https://source.unsplash.com/1200x900/?street,photography&sig=71',
    thumbnailUrl: 'https://source.unsplash.com/400x300/?street,photography&sig=71',
    pricePerHour: 900,
    featured: false,
    specialties: ['Street Photography', 'Documentary', 'Editing Workflow', 'Natural Light'],
    experience: 6,
    students: 180,
    rating: 4.5,
    reviewsCount: 34,
    testimonials: [
      { name: 'Dev Malhotra', rating: 5, text: 'The street walks were eye-opening — great feedback on composition.', date: new Date('2023-03-15') }
    ],
    reviews: [
      { name: 'Dev Malhotra', rating: 5, text: 'Very practical and encouraging.' }
    ],
    videos: [
      { title: 'Street Editing Flow — Neelam', thumbnailUrl: 'https://source.unsplash.com/400x300/?photo,edit&sig=72', url: 'https://example.com/videos/neelam-edit.mp4', duration: '9:45', views: 410 }
    ]
  },
];

const seedAll = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI missing in .env');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB — seeding all data...');

    // By default do NOT delete existing data. We perform upserts so seeding is additive
    // If you want a full reset (delete all artists/workshops/bookings) set RESET_SEED=true
    const shouldReset = process.env.RESET_SEED === 'true';
    if (shouldReset) {
      await Booking.deleteMany({});
      console.log('Deleted all bookings');
      await Workshop.deleteMany({});
      console.log('Deleted all workshops');
      await Artist.deleteMany({});
      console.log('Deleted all artists');
    } else {
      console.log('Skipping destructive deletes. To force full reset set RESET_SEED=true and re-run.');
    }

    // Create artists and sample workshops
    for (const art of artistsSeed) {
      // Resolve unsplash redirects to final images if necessary
      try {
        art.imageUrl = await resolveRedirect(art.imageUrl);
        art.thumbnailUrl = await resolveRedirect(art.thumbnailUrl);
      } catch (err) {
        console.warn('Could not resolve image urls for', art.name, err.message);
      }
      // Upsert the artist (create if not exists, update if exists)
      const filter = { slug: art.slug || art.email };
      const update = { $set: art };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      const created = await Artist.findOneAndUpdate(filter, update, options);
      console.log('Upserted artist:', created.name);

      // Create/Upsert 1-2 sample workshops for each artist (non-destructive)
      const w1Data = {
        title: `${created.name} — Introduction to ${created.category}`,
        artist: created._id,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '10:00 AM - 12:00 PM',
        duration: '2 hours',
        enrolled: Math.floor((created.students || 20) * 0.15) + 5,
        price: Math.round((created.pricePerHour || 500) * 0.8),
        mode: 'online',
        location: 'Zoom',
        description: `A beginner-friendly session by ${created.name}`,
      };

      const w2Data = {
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
      };

      const w1 = await Workshop.findOneAndUpdate({ title: w1Data.title, artist: created._id }, { $set: w1Data }, { upsert: true, new: true, setDefaultsOnInsert: true });
      console.log('  Upserted workshop:', w1.title);

      const w2 = await Workshop.findOneAndUpdate({ title: w2Data.title, artist: created._id }, { $set: w2Data }, { upsert: true, new: true, setDefaultsOnInsert: true });
      console.log('  Upserted workshop:', w2.title);
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedAll();
