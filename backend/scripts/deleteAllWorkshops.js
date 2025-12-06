import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Workshop from '../models/Workshop.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Deleting all workshops...');
  
  const result = await Workshop.deleteMany({});
  console.log(`✅ Deleted ${result.deletedCount} workshops`);
  
  mongoose.connection.close();
}).catch(err => {
  console.error('Error:', err);
  mongoose.connection.close();
});
