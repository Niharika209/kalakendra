import cron from 'node-cron';
import Artist from '../models/Artist.js';
import Workshop from '../models/Workshop.js';
import { searchSync } from '../services/searchSyncService.js';

export const updateArtistAvailabilityJob = cron.schedule('0 * * * *', async () => {
  console.log('[CRON] Starting artist availability update...');
  
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
    
    console.log(`[CRON] Updated availability for ${updated}/${artists.length} artists`);
  } catch (error) {
    console.error('[CRON] Artist availability job failed:', error);
  }
}, {
  scheduled: false
});

export const updateWorkshopStatusJob = cron.schedule('0 0 * * *', async () => {
  console.log('[CRON] Updating workshop statuses...');
  
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
    
    console.log(`[CRON] Marked ${result.modifiedCount} workshops as completed`);
  } catch (error) {
    console.error('[CRON] Workshop status job failed:', error);
  }
}, {
  scheduled: false
});

export const recalculatePopularityJob = cron.schedule('0 2 * * *', async () => {
  console.log('[CRON] Recalculating popularity scores...');
  
  try {

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
    
    console.log(`[CRON] Updated popularity for ${artists.length} artists`);
  } catch (error) {
    console.error('[CRON] Popularity recalculation failed:', error);
  }
}, {
  scheduled: false
});

export const syncHealthCheckJob = cron.schedule('*/5 * * * *', async () => {
  try {
    const threshold = new Date(Date.now() - 10 * 60 * 1000);
    
    const staleArtists = await Artist.countDocuments({
      updatedAt: { $lt: threshold },
      'availabilitySettings.isAvailable': true
    });
    
    if (staleArtists > 100) {
      console.warn(`[HEALTH] ${staleArtists} artists haven't synced in 10+ minutes`);
    }
  } catch (error) {
    console.error('[HEALTH] Health check failed:', error);
  }
}, {
  scheduled: false
});

export function startAllJobs() {
  console.log('Starting background jobs...');
  
  updateArtistAvailabilityJob.start();
  updateWorkshopStatusJob.start();
  recalculatePopularityJob.start();
  syncHealthCheckJob.start();
  
  console.log('All background jobs started');
}

export function stopAllJobs() {
  console.log('Stopping background jobs...');
  
  updateArtistAvailabilityJob.stop();
  updateWorkshopStatusJob.stop();
  recalculatePopularityJob.stop();
  syncHealthCheckJob.stop();
  
  console.log('All background jobs stopped');
}

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
