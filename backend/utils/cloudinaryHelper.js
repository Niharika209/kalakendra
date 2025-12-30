
import cloudinary from '../config/cloudinary.js';

// Delete files from Cloudinary
export const deleteFromCloudinary = async (fileUrl) => {
  try {
    const urlParts = fileUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL');
    }
    
    const publicIdWithFormat = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithFormat.substring(0, publicIdWithFormat.lastIndexOf('.'));
    
    const resourceType = urlParts[uploadIndex - 1];
    
    console.log('Deleting from Cloudinary:', { publicId, resourceType });
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType === 'video' ? 'video' : 'image',
      invalidate: true
    });
    
    console.log('Cloudinary deletion result:', result);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

export const deleteMultipleFromCloudinary = async (fileUrls) => {
  try {
    const deletePromises = fileUrls.map(url => deleteFromCloudinary(url));
    return await Promise.allSettled(deletePromises);
  } catch (error) {
    console.error('Error deleting multiple files from Cloudinary:', error);
    throw error;
  }
};

// To Generate thumbnail URL
export const generateThumbnailUrl = (imageUrl, width = 200, height = 200) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  try {
    const uploadIndex = imageUrl.indexOf('/upload/');
    if (uploadIndex === -1) return imageUrl;
    
    const transformation = `w_${width},h_${height},c_fill,q_auto,f_auto`;
    const thumbnailUrl = 
      imageUrl.slice(0, uploadIndex + 8) + 
      transformation + '/' + 
      imageUrl.slice(uploadIndex + 8);
    
    return thumbnailUrl;
  } catch (error) {
    console.error('Error generating thumbnail URL:', error);
    return imageUrl;
  }
};

// Validate Cloudinary URL
export const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('cloudinary.com/') && url.includes('/upload/');
};

/**
 * Get file info from Cloudinary URL
 * @param {string} fileUrl - Cloudinary URL
 * @returns {Object} File info with publicId, resourceType, format
 */
export const getCloudinaryFileInfo = (fileUrl) => {
  try {
    const urlParts = fileUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      return null;
    }
    
    const publicIdWithFormat = urlParts.slice(uploadIndex + 2).join('/');
    const lastDotIndex = publicIdWithFormat.lastIndexOf('.');
    const publicId = publicIdWithFormat.substring(0, lastDotIndex);
    const format = publicIdWithFormat.substring(lastDotIndex + 1);
    const resourceType = urlParts[uploadIndex - 1];
    
    return {
      publicId,
      format,
      resourceType,
      folder: publicId.substring(0, publicId.lastIndexOf('/'))
    };
  } catch (error) {
    console.error('Error parsing Cloudinary URL:', error);
    return null;
  }
};
