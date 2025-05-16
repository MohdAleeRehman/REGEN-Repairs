/**
 * Device images optimization service
 * Handles image loading, caching, and optimization strategies
 */

// Session storage key for caching image loading states
const CACHE_KEY = 'regen-device-images-loaded';

/**
 * Check if we're on a low bandwidth connection
 * @returns {boolean} True if on a low bandwidth connection
 */
export const isLowBandwidthConnection = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return connection && (
    connection.saveData || 
    (connection.effectiveType && connection.effectiveType.includes('2g')) ||
    (connection.downlink && connection.downlink < 1.0)
  );
};

/**
 * Get cached image loading state from session storage
 * @returns {Object} Map of device IDs to loading states
 */
export const getCachedImageStates = () => {
  try {
    const cachedData = sessionStorage.getItem(CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : {};
  } catch (e) {
    console.error('Error reading image cache:', e);
    return {};
  }
};

/**
 * Save image loading state to session storage
 * @param {string} deviceId - Device ID
 * @param {boolean} isLoaded - Whether the image is loaded
 */
export const saveCachedImageState = (deviceId, isLoaded) => {
  try {
    const existingCache = getCachedImageStates();
    existingCache[deviceId] = isLoaded;
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(existingCache));
  } catch (e) {
    console.error('Error saving to image cache:', e);
  }
};

/**
 * Preload an image with specified priority
 * @param {Object} device - Device object with image_url
 * @param {string} priority - 'high', 'medium', or 'low'
 * @returns {Promise<boolean>} - Resolves to true when image is loaded
 */
export const preloadImage = (device, priority = 'auto') => {
  return new Promise((resolve) => {
    if (!device?.image_url) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    
    img.onload = () => {
      saveCachedImageState(device.id, true);
      resolve(true);
    };
    
    img.onerror = () => {
      console.error(`Failed to load image for ${device.model}`);
      resolve(false);
    };
    
    // Set fetchpriority attribute if supported
    if ('fetchpriority' in img) {
      img.fetchpriority = priority;
    }
    
    // Apply loading strategy based on priority
    img.loading = priority === 'high' ? 'eager' : 'lazy';
    
    // Start loading
    img.src = device.image_url;
  });
};

/**
 * Optimize a Cloudinary URL for the client
 * @param {string} url - Original Cloudinary URL
 * @param {Object} options - Optimization options
 * @returns {string} - Optimized URL
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }
  
  // Determine if we need to serve lower quality images based on connection
  const isLowBandwidth = isLowBandwidthConnection();
  
  const {
    width = 400,
    height = 400,
    quality = isLowBandwidth ? 'auto:eco' : 'auto:good',
    dpr = isLowBandwidth ? '1.0' : 'auto',
    loading = 'lazy'
  } = options;
  
  // Create transformation string with proper Cloudinary syntax
  // Following Cloudinary's recommended approach
  const transformations = [
    `w_${width}`,
    `h_${height}`,
    `c_limit`,
    `q_${quality}`,
    `dpr_${dpr}`,
    'f_auto', // Let Cloudinary automatically select the best format
    'e_sharpen:60',
    loading === 'eager' ? 'fl_progressive' : ''
  ].filter(Boolean).join(',');
  
  // Check if URL already contains transformation parameters
  if (url.includes('/upload/')) {
    // Check if URL already has transformations
    const uploadIndex = url.indexOf('/upload/');
    const nextSlashIndex = url.indexOf('/', uploadIndex + 8); // 8 is the length of '/upload/'
    
    // If there's already a transformation string, replace it
    if (nextSlashIndex > -1 && nextSlashIndex < url.lastIndexOf('/')) {
      const base = url.substring(0, uploadIndex + 8); // Include '/upload/'
      const pathAfterTransform = url.substring(url.indexOf('/', nextSlashIndex + 1));
      return `${base}${transformations}${pathAfterTransform}`;
    }
    // Otherwise add the transformation
    return url.replace('/upload/', `/upload/${transformations}/`);
  } else {
    return url; // Can't transform non-standard Cloudinary URLs
  }
};

export default {
  preloadImage,
  getCachedImageStates,
  saveCachedImageState,
  isLowBandwidthConnection,
  optimizeCloudinaryUrl
};
