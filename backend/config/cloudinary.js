import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Verify configuration
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'MISSING',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' : 'MISSING'
});

export default cloudinary;
