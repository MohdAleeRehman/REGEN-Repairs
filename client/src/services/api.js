import axios from 'axios';
import { auth } from './supabase';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Cache for API responses
const responseCache = new Map();

// Cache timeout in milliseconds (5 minutes)
const CACHE_TIMEOUT = 5 * 60 * 1000;

// Create axios instance with base URL and default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Helper to generate cache key from request
const generateCacheKey = (config) => {
  return `${config.method}:${config.url}:${JSON.stringify(config.params || {})}:${JSON.stringify(config.data || {})}`;
};

// Helper to clear expired cache entries
const clearExpiredCache = () => {
  const now = Date.now();
  responseCache.forEach((value, key) => {
    if (now > value.timestamp + CACHE_TIMEOUT) {
      responseCache.delete(key);
    }
  });
};

// Periodic cache cleanup
setInterval(clearExpiredCache, 60000);

// Add a request interceptor for debugging
apiClient.interceptors.request.use(
  async config => {
    // Check cache for GET requests
    if (config.method === 'get' && config.cache !== false) {
      const key = generateCacheKey(config);
      const cachedResponse = responseCache.get(key);
      
      if (cachedResponse && Date.now() < cachedResponse.timestamp + CACHE_TIMEOUT) {
        // Return cached response by attaching it to config for later use
        config.cachedResponse = cachedResponse.data;
      }
    }
    
    // Add auth token to requests if available
    try {
      const session = await auth.getSession();
      if (session && session.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
      // Continue with the request even without the token
    }
    
    // Log every outgoing request
    console.log('API Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: {
        ...config.headers,
        Authorization: config.headers.Authorization ? '[REDACTED]' : undefined
      },
    });
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    // If response was already cached and used, return early
    if (response.config.cachedResponse) {
      response.data = response.config.cachedResponse;
      response.fromCache = true;
      return response;
    }
    
    // For GET requests, cache the successful response
    if (response.config.method === 'get' && response.config.cache !== false) {
      const key = generateCacheKey(response.config);
      responseCache.set(key, {
        timestamp: Date.now(),
        data: response.data
      });
    }
    
    return response;
  },
  error => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

export default {
  // Device related API calls
  devices: {
    getAll() {
      return apiClient.get('/devices');
    },
    getById(id) {
      return apiClient.get(`/devices/${id}`);
    },
    create(deviceData) {
      return apiClient.post('/devices', deviceData);
    },
    update(id, deviceData) {
      return apiClient.put(`/devices/${id}`, deviceData);
    },
    delete(id) {
      return apiClient.delete(`/devices/${id}`);
    },
    seedFromCsv() {
      return apiClient.post('/devices/seed');
    },
    uploadImage(id, imageFile) {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('image', imageFile);
      
      // Custom headers for file upload
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      return apiClient.post(`/devices/${id}/image`, formData, config);
    }
  },
  
  // Repairs related API calls
  repairs: {
    getAll() {
      return apiClient.get('/repairs');
    },
    getByDeviceId(deviceId) {
      return apiClient.get(`/repairs/device/${deviceId}`);
    },
    getPricingData() {
      return apiClient.get('/repairs/pricing');
    },
    updatePrices(pricingData) {
      return apiClient.put('/repairs/pricing', pricingData);
    }
  },
  
  // Submissions related API calls
  submissions: {
    getAll() {
      return apiClient.get('/submissions');
    },
    getById(id) {
      return apiClient.get(`/submissions/${id}`);
    },
    create(data) {
      return apiClient.post('/submissions', data);
    },
    savePartial(data) {
      return apiClient.post('/submissions/partial', data);
    },
    updateStatus(id, status, additionalData = {}) {
      console.log(`API: Updating submission ${id} to status: ${status}`);
      // Ensure ID is properly formatted as Supabase may expect a number type ID
      const submissionId = parseInt(id, 10);
      if (isNaN(submissionId)) {
        console.error(`Invalid submission ID format: ${id}`);
        return Promise.reject(new Error("Invalid submission ID format"));
      }
      
      // Create payload with status and any additional data (like cancellation notes)
      const payload = { 
        status,
        ...additionalData
      };
      
      console.log(`Sending status update payload:`, payload);
      
      return apiClient.patch(`/submissions/${submissionId}/status`, payload);
    },
  }
};