// Artist ranking score calculation
export function calculateRankingScore(artist) {
  const featured = artist.featured ? 1000 : 0;
  const rating = (artist.rating || 0) * 200;
  const availability = artist.availabilitySettings?.isAvailable ? 50 : 0;
  const popularity = (artist.totalBookings || 0) * 10;
  const experience = (artist.experienceYears || 0) * 5;
  
  return featured + rating + availability + popularity + experience;
}

export function sortByRankingScore(artists) {
  return artists
    .map(artist => ({
      ...artist,
      rankingScore: calculateRankingScore(artist)
    }))
    .sort((a, b) => b.rankingScore - a.rankingScore);
}
