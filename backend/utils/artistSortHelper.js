/**
 * Calculate composite ranking score for an artist
 * Formula: (Featured × 1000) + (Rating × 200) + (Availability × 50) + (Popularity × 10) + (Experience × 5)
 * @param {object} artist - Artist document
 * @returns {number} Ranking score
 */
export function calculateRankingScore(artist) {
  const featured = artist.featured ? 1000 : 0;
  const rating = (artist.rating || 0) * 200;
  const availability = artist.availabilitySettings?.isAvailable ? 50 : 0;
  const popularity = (artist.totalBookings || 0) * 10;
  const experience = (artist.experienceYears || 0) * 5;
  
  return featured + rating + availability + popularity + experience;
}

/**
 * Add ranking scores to artists and sort by composite score
 * @param {Array} artists - Array of artist documents
 * @returns {Array} Sorted artists with rankingScore field
 */
export function sortByRankingScore(artists) {
  return artists
    .map(artist => ({
      ...artist,
      rankingScore: calculateRankingScore(artist)
    }))
    .sort((a, b) => b.rankingScore - a.rankingScore);
}
