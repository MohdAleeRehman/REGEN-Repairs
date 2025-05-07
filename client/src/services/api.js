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
    updateStatus(id, status) {
      return apiClient.patch(`/submissions/${id}/status`, { status });
    },
  }
};