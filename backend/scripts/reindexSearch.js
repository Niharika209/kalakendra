/**
 * Bulk Re-indexing Script
 * 
 * Usage:
 * npm run reindex              # Reindex everything
 * npm run reindex -- --artists # Reindex only artists
 * npm run reindex -- --workshops # Reindex only workshops
 * 
 * Run this when:
 * - Initial search setup
 * - After schema changes
 * - Data migration
 * - Fixing search inconsistencies
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { searchSync } from '../services/searchSyncService.js';
import Artist from '../models/Artist.js';
import Workshop from '../models/Workshop.js';

dotenv.config();

const args = process.argv.slice(2);
const artistsOnly = args.includes('--artists');
const workshopsOnly = args.includes('--workshops');

async function reindexAll() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    if (!workshopsOnly) {
      console.log('\n📚 Starting artist reindex...');
      const artistResult = await searchSync.bulkReindexArtists(100);
      console.log(`✅ Artists reindexed: ${artistResult.totalProcessed}`);
    }

    if (!artistsOnly) {
      console.log('\n🎨 Starting workshop reindex...');
      const workshopResult = await searchSync.bulkReindexWorkshops(100);
      console.log(`✅ Workshops reindexed: ${workshopResult.totalProcessed}`);
    }

    console.log('\n🎉 Reindexing complete!');
    console.log('⏳ Atlas Search will sync within 1-10 seconds...');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Reindexing failed:', error);
    process.exit(1);
  }
}

reindexAll();
