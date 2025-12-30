import Artist from '../models/Artist.js';
import Workshop from '../models/Workshop.js';
import Booking from '../models/Booking.js';
import EventEmitter from 'events';

export const searchSyncEmitter = new EventEmitter();

class SearchSyncService {
  constructor() {
    this.retryAttempts = 3;
    this.retryDelay = 1000;
  }

  // Artist sync
  async syncArtist(artistId) {
    try {
      const artist = await Artist.findById(artistId);
      if (!artist) return;
      
      console.log(`Artist synced to search: ${artist.name}`);
      searchSyncEmitter.emit('artist:synced', { artistId, name: artist.name });
      
      await this.syncArtistWorkshops(artistId);
      
      return { success: true, artistId };
    } catch (error) {
      console.error('Artist sync failed:', error);
      searchSyncEmitter.emit('sync:error', { type: 'artist', artistId, error });
      throw error;
    }
  }

  async syncArtistWorkshops(artistId) {
    try {
      const workshops = await Workshop.find({ artist: artistId });
      
      for (const workshop of workshops) {
        await workshop.save();
      }
      
      console.log(`Synced ${workshops.length} workshops for artist ${artistId}`);
      return workshops.length;
    } catch (error) {
      console.error('Workshop sync failed:', error);
      throw error;
    }
  }

  // Workshop sync
  async syncWorkshop(workshopId) {
    try {
      const workshop = await Workshop.findById(workshopId).populate('artist', 'name category rating');
      if (!workshop) return;
      
      console.log(`Workshop synced to search: ${workshop.title}`);
      searchSyncEmitter.emit('workshop:synced', { workshopId, title: workshop.title });
      
      return { success: true, workshopId };
    } catch (error) {
      console.error('Workshop sync failed:', error);
      searchSyncEmitter.emit('sync:error', { type: 'workshop', workshopId, error });
      throw error;
    }
  }

  // Update workshop availability
  async updateWorkshopAvailability(workshopId) {
    try {
      const workshop = await Workshop.findById(workshopId);
      if (!workshop) return;

      await workshop.save();
      
      console.log(`Workshop availability updated: ${workshop.title}`);
      searchSyncEmitter.emit('availability:updated', { 
        workshopId, 
        seatsAvailable: workshop.seatsAvailable,
        isFullyBooked: workshop.isFullyBooked 
      });
      
      return { success: true, seatsAvailable: workshop.seatsAvailable };
    } catch (error) {
      console.error('Availability update failed:', error);
      throw error;
    }
  }

  // Update artist availability
  async updateArtistAvailability(artistId) {
    try {
      const artist = await Artist.findById(artistId);
      if (!artist || !artist.availability) return;

      const now = new Date();
      let nextDate = null;

      const sortedAvailability = artist.availability
        .filter(slot => new Date(slot.date) >= now && slot.slots.length > 0)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      if (sortedAvailability.length > 0) {
        nextDate = sortedAvailability[0].date;
      }

      artist.availabilitySettings.nextAvailableDate = nextDate;
      artist.availabilitySettings.isAvailable = nextDate !== null;
      await artist.save();

      console.log(`Artist availability updated: ${artist.name}, next available: ${nextDate}`);
      
      return { success: true, nextAvailableDate: nextDate };
    } catch (error) {
      console.error('Artist availability update failed:', error);
      throw error;
    }
  }

  // Handle document deletion
  async handleDeletion(modelName, docId) {
    console.log(`${modelName} deleted from search: ${docId}`);
    searchSyncEmitter.emit('document:deleted', { modelName, docId });
  }

  // Bulk reindex operations
  async bulkReindexArtists(batchSize = 100) {
    try {
      const totalArtists = await Artist.countDocuments();
      let processed = 0;

      console.log(`Starting bulk re-index of ${totalArtists} artists...`);

      while (processed < totalArtists) {
        const artists = await Artist.find()
          .skip(processed)
          .limit(batchSize)
          .lean();

        for (const artist of artists) {
          try {
            await Artist.findByIdAndUpdate(artist._id, {
              $set: { updatedAt: new Date() }
            });
          } catch (err) {
            console.error(`Failed to reindex artist ${artist._id}:`, err);
          }
        }

        processed += artists.length;
        console.log(`Progress: ${processed}/${totalArtists} artists reindexed`);
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`Bulk reindex complete: ${totalArtists} artists`);
      return { success: true, totalProcessed: totalArtists };
    } catch (error) {
      console.error('Bulk reindex failed:', error);
      throw error;
    }
  }

  async bulkReindexWorkshops(batchSize = 100) {
    try {
      const totalWorkshops = await Workshop.countDocuments();
      let processed = 0;

      console.log(`Starting bulk re-index of ${totalWorkshops} workshops...`);

      while (processed < totalWorkshops) {
        const workshops = await Workshop.find()
          .skip(processed)
          .limit(batchSize)
          .lean();

        for (const workshop of workshops) {
          try {
            await Workshop.findByIdAndUpdate(workshop._id, {
              $set: { updatedAt: new Date() }
            });
          } catch (err) {
            console.error(`Failed to reindex workshop ${workshop._id}:`, err);
          }
        }

        processed += workshops.length;
        console.log(`Progress: ${processed}/${totalWorkshops} workshops reindexed`);
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log(`Bulk reindex complete: ${totalWorkshops} workshops`);
      return { success: true, totalProcessed: totalWorkshops };
    } catch (error) {
      console.error('Bulk reindex failed:', error);
      throw error;
    }
  }

  // Retry with exponential backoff
  async retryOperation(operation, attempts = this.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
      try {
        return await operation();
      } catch (error) {
        if (i === attempts - 1) throw error;
        
        const delay = this.retryDelay * Math.pow(2, i);
        console.log(`Retry attempt ${i + 1}/${attempts} after ${delay}ms`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
}

export const searchSync = new SearchSyncService();

// Event listeners
searchSyncEmitter.on('artist:synced', ({ artistId, name }) => {
});

searchSyncEmitter.on('workshop:synced', ({ workshopId, title }) => {

});

searchSyncEmitter.on('sync:error', ({ type, error }) => {
  console.error(`Sync error for ${type}:`, error.message);
});

export default searchSync;
