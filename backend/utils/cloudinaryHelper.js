
import cloudinary from '../config/cloudinary.js';

/**
 * Delete a file from Cloudinary by URL
 * @param {string} fileUrl - The Cloudinary URL of the file to delete
 * @returns {Promise<Object>} Deletion result
 */
export const deleteFromCloudinary = async (fileUrl) => {
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const urlParts = fileUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    
    if (uploadIndex === -1) {
      throw new Error('Invalid Cloudinary URL');
    }
    
    // Get everything after 'upload' and the version number
    const publicIdWithFormat = urlParts.slice(uploadIndex + 2).join('/');
    const publicId = publicIdWithFormat.substring(0, publicIdWithFormat.lastIndexOf('.'));
    
    // Determine resource type from URL
    const resourceType = urlParts[uploadIndex - 1]; // 'image' or 'video'
    
    console.log('🗑️ Deleting from Cloudinary:', { publicId, resourceType });
    
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType === 'video' ? 'video' : 'image',
      invalidate: true
    });
    
    console.log('✅ Cloudinary deletion result:', result);
    return result;
  } catch (error) {
    console.error('❌ Error deleting from Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {string[]} fileUrls - Array of Cloudinary URLs to delete
 * @returns {Promise<Object[]>} Array of deletion results
 */
export const deleteMultipleFromCloudinary = async (fileUrls) => {
  try {
    const deletePromises = fileUrls.map(url => deleteFromCloudinary(url));
    return await Promise.allSettled(deletePromises);
  } catch (error) {
    console.error('❌ Error deleting multiple files from Cloudinary:', error);
    throw error;
  }
};

/**
 * Generate a thumbnail URL from a Cloudinary image URL
 * @param {string} imageUrl - Original Cloudinary image URL
 * @param {number} width - Thumbnail width (default: 200)
 * @param {number} height - Thumbnail height (default: 200)
 * @returns {string} Thumbnail URL
 */
export const generateThumbnailUrl = (imageUrl, width = 200, height = 200) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  try {
    // Insert transformation parameters before the version number
    const uploadIndex = imageUrl.indexOf('/upload/');
    if (uploadIndex === -1) return imageUrl;
    
    const transformation = `w_${width},h_${height},c_fill,q_auto,f_auto`;
    const thumbnailUrl = 
      imageUrl.slice(0, uploadIndex + 8) + 
      transformation + '/' + 
      imageUrl.slice(uploadIndex + 8);
    
    return thumbnailUrl;
  } catch (error) {
    console.error('❌ Error generating thumbnail URL:', error);
    return imageUrl;
  }
};

/**
 * Validate if a URL is from Cloudinary
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid Cloudinary URL
 */
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
    console.error('❌ Error parsing Cloudinary URL:', error);
    return null;
  }
};
