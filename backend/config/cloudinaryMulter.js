import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    const uploadType = req.uploadType || 'general';
    
    return {
      folder: `kalakendra/${uploadType}`,
      allowed_formats: isVideo 
        ? ['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv', 'wmv']
        : ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'],
      resource_type: isVideo ? 'video' : 'image',
      transformation: isVideo ? [] : [
        { width: 1200, height: 1200, crop: 'limit', quality: 'auto:good' }
      ]
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  const allowedVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm'];
  
  if (allowedImageTypes.includes(file.mimetype) || allowedVideoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not supported. Please upload images or videos only.`), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024,
    files: 10
  },
});

export default upload;
