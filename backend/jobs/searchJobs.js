/**
 * Background Jobs for Search Index Maintenance
 * 
 * Scheduled tasks to keep search indexes optimized:
 * 1. Update artist availability (nextAvailableDate)
 * 2. Clean up stale workshop data
 * 3. Recalculate popularity scores
 * 4. Monitor sync health
 * 
 * Use with node-cron or any job scheduler
 */

import cron from 'node-cron';
import Artist from '../models/Artist.js';
import Workshop from '../models/Workshop.js';
import { searchSync } from '../services/searchSyncService.js';

/**
 * Job 1: Update Artist Availability
 * Runs every hour to update nextAvailableDate for all artists
 */
export const updateArtistAvailabilityJob = cron.schedule('0 * * * *', async () => {
  console.log('🕐 [CRON] Starting artist availability update...');
  
  try {
    const artists = await Artist.find({ 
      'availabilitySettings.isAvailable': true 
    }).select('_id name availability availabilitySettings');
    
    let updated = 0;
    
    for (const artist of artists) {
      try {
        await searchSync.updateArtistAvailability(artist._id);
        updated++;
      } catch (error) {
        console.error(`Failed to update artist ${artist._id}:`, error);
      }
    }
    
    console.log(`✅ [CRON] Updated availability for ${updated}/${artists.length} artists`);
  } catch (error) {
    console.error('❌ [CRON] Artist availability job failed:', error);
  }
}, {
  scheduled: false // Start manually with .start()
});

/**
 * Job 2: Mark Past Workshops as Completed
 * Runs daily at midnight to update workshop status
 */
export const updateWorkshopStatusJob = cron.schedule('0 0 * * *', async () => {
  console.log('🕐 [CRON] Updating workshop statuses...');
  
  try {
    const now = new Date();
    const result = await Workshop.updateMany(
      {
        date: { $lt: now },
        status: 'active'
      },
      {
        $set: { status: 'completed' }
      }
    );
    
    console.log(`✅ [CRON] Marked ${result.modifiedCount} workshops as completed`);
  } catch (error) {
    console.error('❌ [CRON] Workshop status job failed:', error);
  }
}, {
  scheduled: false
});

/**
 * Job 3: Recalculate Popularity Scores
 * Runs daily at 2 AM to update booking counts and view counts
 */
export const recalculatePopularityJob = cron.schedule('0 2 * * *', async () => {
  console.log('🕐 [CRON] Recalculating popularity scores...');
  
  try {
    // Update artist booking counts
    const artists = await Artist.find().select('_id');
    
    for (const artist of artists) {
      const Workshop = (await import('../models/Workshop.js')).default;
      const Booking = (await import('../models/Booking.js')).default;
      
      const workshops = await Workshop.find({ artist: artist._id });
      const workshopIds = workshops.map(w => w._id);
      
      const bookingCount = await Booking.countDocuments({
        workshop: { $in: workshopIds },
        status: { $in: ['confirmed', 'pending'] }
      });
      
      await Artist.findByIdAndUpdate(artist._id, {
        $set: { totalBookings: bookingCount }
      });
    }
    
    console.log(`✅ [CRON] Updated popularity for ${artists.length} artists`);
  } catch (error) {
    console.error('❌ [CRON] Popularity recalculation failed:', error);
  }
}, {
  scheduled: false
});

/**
 * Job 4: Health Check & Sync Monitor
 * Runs every 5 minutes to monitor sync delays
 */
export const syncHealthCheckJob = cron.schedule('*/5 * * * *', async () => {
  // Check for documents that haven't synced in a while
  try {
    const threshold = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes
    
    const staleArtists = await Artist.countDocuments({
      updatedAt: { $lt: threshold },
      'availabilitySettings.isAvailable': true
    });
    
    if (staleArtists > 100) {
      console.warn(`⚠️ [HEALTH] ${staleArtists} artists haven't synced in 10+ minutes`);
    }
  } catch (error) {
    console.error('❌ [HEALTH] Health check failed:', error);
  }
}, {
  scheduled: false
});

/**
 * Start all background jobs
 */
export function startAllJobs() {
  console.log('🚀 Starting background jobs...');
  
  updateArtistAvailabilityJob.start();
  updateWorkshopStatusJob.start();
  recalculatePopularityJob.start();
  syncHealthCheckJob.start();
  
  console.log('✅ All background jobs started');
}

/**
 * Stop all background jobs (for graceful shutdown)
 */
export function stopAllJobs() {
  console.log('🛑 Stopping background jobs...');
  
  updateArtistAvailabilityJob.stop();
  updateWorkshopStatusJob.stop();
  recalculatePopularityJob.stop();
  syncHealthCheckJob.stop();
  
  console.log('✅ All background jobs stopped');
}

/**
 * Manual trigger functions (for testing or admin panel)
 */
export const manualJobs = {
  updateAllArtistAvailability: async () => {
    const artists = await Artist.find();
    for (const artist of artists) {
      await searchSync.updateArtistAvailability(artist._id);
    }
    return { success: true, count: artists.length };
  },
  
  fullReindex: async () => {
    const artistResult = await searchSync.bulkReindexArtists();
    const workshopResult = await searchSync.bulkReindexWorkshops();
    return { artists: artistResult, workshops: workshopResult };
  }
};

export default {
  startAllJobs,
  stopAllJobs,
  manualJobs
};
