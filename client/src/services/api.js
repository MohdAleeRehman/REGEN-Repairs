import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with base URL and default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor for debugging
apiClient.interceptors.request.use(
  config => {
    // Log every outgoing request
    console.log('API Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers,
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
  response => response,
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