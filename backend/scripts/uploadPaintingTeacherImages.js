import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const uploadPaintingTeacherImages = async () => {
  const imagesToUpload = [
    { name: 'hardiniparikh', file: 'hardiniparikh.jpg' },
    { name: 'noorjaahn', file: 'noorjaahn.jpg' },
    { name: 'navyapaints', file: 'navyapaints.jpg' },
    { name: 'priyankasharma-affectart', file: 'anvishetty.jpg' }, // Using anvishetty as placeholder for priyanka
    { name: 'dnegerart', file: 'dnegerart.jpg' }
  ];

  console.log('Uploading Painting Teacher Images to Cloudinary...\n');

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

  console.log('\n🎉 All painting teacher images uploaded!');
};

uploadPaintingTeacherImages();
