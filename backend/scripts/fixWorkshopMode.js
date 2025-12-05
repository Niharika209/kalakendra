/**
 * Fix Workshop Mode Capitalization
 * 
 * This script converts capitalized mode values (Online, Offline, Hybrid)
 * to lowercase (online, offline, hybrid) to match the schema enum
 * 
 * Usage:
 * node scripts/fixWorkshopMode.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Workshop from '../models/Workshop.js';

dotenv.config();

async function fixWorkshopMode() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🔧 Fixing workshop mode values...');
    
    // Fix "Online" -> "online"
    const onlineResult = await Workshop.updateMany(
      { mode: 'Online' },
      { $set: { mode: 'online' } }
    );
    console.log(`✅ Fixed ${onlineResult.modifiedCount} workshops with "Online" -> "online"`);

    // Fix "Offline" -> "offline"
    const offlineResult = await Workshop.updateMany(
      { mode: 'Offline' },
      { $set: { mode: 'offline' } }
    );
    console.log(`✅ Fixed ${offlineResult.modifiedCount} workshops with "Offline" -> "offline"`);

    // Fix "Hybrid" -> "hybrid"
    const hybridResult = await Workshop.updateMany(
      { mode: 'Hybrid' },
      { $set: { mode: 'hybrid' } }
    );
    console.log(`✅ Fixed ${hybridResult.modifiedCount} workshops with "Hybrid" -> "hybrid"`);

    // Check for any other invalid values
    const invalidModes = await Workshop.find({
      mode: { $nin: ['online', 'offline', 'hybrid'] }
    }).select('title mode');

    if (invalidModes.length > 0) {
      console.log('\n⚠️  Found workshops with invalid mode values:');
      invalidModes.forEach(w => {
        console.log(`   - ${w.title}: mode="${w.mode}"`);
      });
      console.log('💡 Setting them to default "online"...');
      await Workshop.updateMany(
        { mode: { $nin: ['online', 'offline', 'hybrid'] } },
        { $set: { mode: 'online' } }
      );
    }

    console.log('\n🎉 Workshop mode fix complete!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Fix failed:', error);
    process.exit(1);
  }
}

fixWorkshopMode();
