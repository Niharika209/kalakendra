import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Map of artist slugs to their image files
const artistImages = {
  'mukta-nagpal': 'mukta_nagpal.jpg',
  'ash-rao': 'ash_rao.jpg',
  'yoshetaa': 'yosheta.jpg',
  'tejal-pimpley': 'tejalpimpley.jpg',
  'priya-sharma-teamnaach': 'priyasharma.jpg'
};

const frontendAssetsPath = path.join(__dirname, '../../frontend/src/assets');

async function uploadImages() {
  console.log('Starting artist image uploads to Cloudinary...\n');
  
  const uploadResults = {};

  for (const [slug, filename] of Object.entries(artistImages)) {
    const imagePath = path.join(frontendAssetsPath, filename);
    
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️  Image not found: ${filename}`);
      continue;
    }

    try {
      console.log(`📤 Uploading ${filename} for ${slug}...`);
      
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'kalakendra/artists',
        public_id: slug,
        transformation: [
          { width: 800, height: 800, crop: 'fill', gravity: 'face' }
        ]
      });

      uploadResults[slug] = {
        imageUrl: result.secure_url,
        thumbnailUrl: result.secure_url.replace('/upload/', '/upload/w_200,h_200,c_fill,g_face/')
      };

      console.log(`✅ Uploaded: ${result.secure_url}\n`);
    } catch (error) {
      console.error(`❌ Error uploading ${filename}:`, error.message);
    }
  }

  console.log('\n📋 Upload Results:');
  console.log('='.repeat(80));
  console.log(JSON.stringify(uploadResults, null, 2));
  console.log('='.repeat(80));
  console.log('\n✨ Upload complete! Copy the URLs above to update seeddata1.js');
}

uploadImages().catch(console.error);
