import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const uploadMusicTeacherImages = async () => {
  const imagesToUpload = [
    { name: 'abhishekvijay', file: 'abhishekvijay.jpg' },
    { name: 'ranjithgovind', file: 'ranjithgovind.jpg' },
    { name: 'snehakapoor', file: 'snehakapoor.jpg' },
    { name: 'amitdesai', file: 'amitdesai.jpg' },
    { name: 'racheldsouza', file: 'racheldsouza.jpg' }
  ];

  console.log('Uploading Music Teacher Images to Cloudinary...\n');

  for (const image of imagesToUpload) {
    try {
      const imagePath = path.join(__dirname, '../../frontend/src/assets', image.file);
      
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'kalakendra/artists',
        public_id: image.name,
        transformation: [
          { width: 800, height: 800, crop: 'fill', gravity: 'face' }
        ]
      });

      console.log(`✅ Uploaded ${image.name}: ${result.secure_url}`);
    } catch (error) {
      console.error(`❌ Error uploading ${image.name}:`, error.message);
    }
  }

  console.log('\n🎉 All music teacher images uploaded!');
};

uploadMusicTeacherImages();
