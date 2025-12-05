/**
 * Fix Invalid Coordinates Script
 * 
 * This script fixes artists and workshops that have invalid GeoJSON coordinates
 * (e.g., coordinates object without the actual coordinates array)
 * 
 * Usage:
 * node scripts/fixCoordinates.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Artist from '../models/Artist.js';
import Workshop from '../models/Workshop.js';

dotenv.config();

async function fixInvalidCoordinates() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Fix Artists with invalid coordinates
    console.log('\n📍 Fixing invalid artist coordinates...');
    const artistsResult = await Artist.updateMany(
      {
        $or: [
          { 'coordinates.coordinates': { $exists: false } },
          { 'coordinates.coordinates': null },
          { 'coordinates.coordinates': [] }
        ]
      },
      {
        $unset: { coordinates: "" }
      }
    );
    console.log(`✅ Fixed ${artistsResult.modifiedCount} artists`);

    // Fix Workshops with invalid coordinates
    console.log('\n📍 Fixing invalid workshop coordinates...');
    const workshopsResult = await Workshop.updateMany(
      {
        $or: [
          { 'coordinates.coordinates': { $exists: false } },
          { 'coordinates.coordinates': null },
          { 'coordinates.coordinates': [] }
        ]
      },
      {
        $unset: { coordinates: "" }
      }
    );
    console.log(`✅ Fixed ${workshopsResult.modifiedCount} workshops`);

    console.log('\n🎉 Coordinate fix complete!');
    console.log('💡 Invalid coordinates have been removed.');
    console.log('💡 You can now add proper coordinates via geocoding or manual entry.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  }
}

fixInvalidCoordinates();
