const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dl1kjmaoq',
  api_key: process.env.CLOUDINARY_API_KEY || '191857187442571',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'SVGj5xvwpoNz5ThdhStmi2czueQ',
  secure: true
});

/**
 * Get optimized transformation settings based on the device type
 * @param {string} [deviceType='phone'] - The type of device ('phone', 'tablet', etc.)
 * @returns {Object} - Optimized transformation settings
 */
const getOptimizedTransformations = (deviceType = 'phone') => {
  // Base settings for all device types
  const baseSettings = {
    quality: 'auto:best',
    fetch_format: 'webp',
    dpr: '2.0',
    loading: 'lazy'
  };
  
  // Device-specific optimizations
  switch(deviceType) {
    case 'phone':
      return {
        ...baseSettings,
        width: 400,
        height: 400,
        crop: 'limit',
        effect: 'sharpen:100'
      };
    case 'tablet':
      return {
        ...baseSettings,
        width: 600,
        height: 600,
        crop: 'limit'
      };
    default:
      return baseSettings;
  }
};

/**
 * Upload an image to Cloudinary
 * @param {Buffer|string} file - The file buffer or path
 * @param {string} folder - The folder to upload to in Cloudinary
 * @param {Object} options - Additional options for the upload
 * @returns {Promise<Object>} - Cloudinary upload result
 */
const uploadImage = async (file, folder = 'device_images', options = {}) => {
  try {
    // Merge options with optimized defaults
    const optimizedDefaults = getOptimizedTransformations('phone');
    const uploadOptions = {
      folder,
      ...optimizedDefaults,
      ...options
    };

    const result = await cloudinary.uploader.upload(file, uploadOptions);
    
    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Generate a Cloudinary URL with transformations
 * @param {string} publicId - The public ID of the image
 * @param {Object} transformations - Transformation options
 * @param {string} [deviceType='phone'] - The type of device
 * @returns {string} - Transformed URL
 */
const getImageUrl = (publicId, transformations = {}, deviceType = 'phone') => {
  const optimizedDefaults = getOptimizedTransformations(deviceType);
  
  return cloudinary.url(publicId, {
    ...optimizedDefaults,
    ...transformations,
    secure: true
  });
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - The public ID of the image
 * @returns {Promise<Object>} - Deletion result
 */
const deleteImage = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  getImageUrl,
  deleteImage,
  getOptimizedTransformations
};
