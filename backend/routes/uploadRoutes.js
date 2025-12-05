import express from 'express';
import upload from '../config/cloudinaryMulter.js';

const router = express.Router();

// POST /api/upload/image - Upload single image to Cloudinary
router.post('/image', (req, res) => {
  console.log('📤 Upload request received');
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('Query params:', req.query);
  console.log('Body keys:', Object.keys(req.body || {}));
  
  // Set upload type for folder organization
  req.uploadType = req.query.type || 'images';
  
  const uploadHandler = upload.single('file');
  
  uploadHandler(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        field: err.field,
        storageErrors: err.storageErrors
      });
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Upload failed',
        error: err.name || err.code || 'UPLOAD_ERROR',
        hint: 'Check: 1) Field name is "file" 2) File type is allowed 3) File size < 50MB 4) Cloudinary credentials are set'
      });
    }

    try {
      if (!req.file) {
        console.log('❌ No file in request');
        console.log('Request files:', req.files);
        console.log('Request body:', req.body);
        return res.status(400).json({ 
          success: false, 
          message: 'No file uploaded. Make sure the field name is "file"' 
        });
      }

      console.log('✅ File uploaded successfully:', {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
      
      // Return the Cloudinary URL
      res.json({
        success: true,
        url: req.file.path,
        public_id: req.file.filename,
        message: 'Image uploaded successfully'
      });
    } catch (error) {
      console.error('❌ Upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error uploading image',
        error: error.message 
      });
    }
  });
});

// POST /api/upload/multiple - Upload multiple media files (images/videos)
router.post('/multiple', (req, res) => {
  // Set upload type for folder organization
  req.uploadType = req.query.type || 'gallery';
  
  const uploadHandler = upload.array('files', 10);
  
  uploadHandler(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ 
        success: false, 
        message: err.message || 'Upload failed',
        error: err.name || err.code || 'UPLOAD_ERROR'
      });
    }

    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'No files uploaded' 
        });
      }

      const uploadedFiles = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));

      res.json({
        success: true,
        files: uploadedFiles,
        count: uploadedFiles.length,
        message: 'Files uploaded successfully'
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error uploading files',
        error: error.message 
      });
    }
  });
});

export default router;
