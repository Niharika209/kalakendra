import axios from 'axios';

const testSort = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/artists');
    const artists = response.data;
    
    const prernaArtists = artists.filter(a => a.name === 'Prerna Sharma');
    
    console.log(`\nFound ${prernaArtists.length} Prerna Sharma artists:\n`);
    
    prernaArtists.forEach((artist, index) => {
      const score = 
        (artist.featured ? 1000 : 0) +
        ((artist.rating || 0) * 200) +
        (artist.availabilitySettings?.isAvailable ? 50 : 0) +
        ((artist.totalBookings || 0) * 10) +
        ((artist.experienceYears || 0) * 5);
      
      console.log(`Position ${index + 1}: ${artist.slug}`);
      console.log(`  Featured: ${artist.featured}`);
      console.log(`  Rating: ${artist.rating}`);
      console.log(`  Available: ${artist.availabilitySettings?.isAvailable}`);
      console.log(`  Total Bookings: ${artist.totalBookings || 0}`);
      console.log(`  Experience Years: ${artist.experienceYears || 0}`);
      console.log(`  CALCULATED SCORE: ${score}`);
      console.log(`  rankingScore from API: ${artist.rankingScore}\n`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testSort();
