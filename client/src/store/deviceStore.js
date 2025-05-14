import { defineStore } from 'pinia';
import api from '../services/api';

export const useDeviceStore = defineStore('device', {
  state: () => ({
    devices: [],
    selectedDevice: null,
    isLoading: false,
    error: null,
  }),
  
  actions: {
    async fetchDevices() {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Use the server API instead of direct Supabase call
        const response = await api.devices.getAll();
        const devices = response.data;
        
        // Custom sort function to order devices according to the specified sequence
        const customOrder = [
          // iPhone 16 series
          'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
          // iPhone 15 series
          'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
          // iPhone 14 series
          'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
          // iPhone SE and 13 series
          'iPhone SE (3rd Gen)', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
          // iPhone 12 series
          'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini',
          // iPhone SE and 11 series
          'iPhone SE (2nd Gen)', 'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
          // iPhone XS and X series
          'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
          // iPhone 8 series
          'iPhone 8 Plus', 'iPhone 8',
          // iPhone 7 series
          'iPhone 7 Plus', 'iPhone 7'
        ];
        
        // Sort the data based on the custom order
        this.devices = [...devices].sort((a, b) => {
          // If different brands, sort alphabetically by brand
          if (a.brand !== b.brand) {
            return a.brand.localeCompare(b.brand);
          }
          
          // If both models are in our custom order array
          const indexA = customOrder.indexOf(a.model);
          const indexB = customOrder.indexOf(b.model);
          
          // If both models are in our custom order array
          if (indexA >= 0 && indexB >= 0) {
            return indexA - indexB;
          }
          
          // If only one model is in our custom order array, prioritize it
          if (indexA >= 0) return -1;
          if (indexB >= 0) return 1;
          
          // If neither model is in our array, fall back to alphabetical ordering
          return a.model.localeCompare(b.model);
        });
      } catch (error) {
        this.error = error.response?.data?.error || error.message || 'Failed to fetch devices';
        console.error('Error fetching devices:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    selectDevice(device) {
      this.selectedDevice = device;
    },
    
    clearSelection() {
      this.selectedDevice = null;
    },
    
    // Admin functions for device management
    async addDevice(device) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Use the server API instead of direct Supabase call to bypass RLS
        const response = await api.devices.create(device);
        const newDevice = response.data;
        this.devices.push(newDevice);
        return newDevice;
      } catch (error) {
        // Handle authentication errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.error = 'You must be logged in as an admin to add devices';
          console.error('Authentication error:', error.response?.data);
        } else {
          this.error = error.response?.data?.error || error.message || 'Failed to add device';
          console.error('Error adding device:', error);
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async updateDevice(device) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Use the server API instead of direct Supabase call
        const response = await api.devices.update(device.id, device);
        const updatedDevice = response.data;
        
        // Update device in local state
        const index = this.devices.findIndex(d => d.id === device.id);
        if (index !== -1) {
          this.devices[index] = updatedDevice;
        }
        
        return updatedDevice;
      } catch (error) {
        // Handle authentication errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.error = 'You must be logged in as an admin to update devices';
          console.error('Authentication error:', error.response?.data);
        } else {
          this.error = error.response?.data?.error || error.message || 'Failed to update device';
          console.error('Error updating device:', error);
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async deleteDevice(id) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Use the server API instead of direct Supabase call
        await api.devices.delete(id);
        
        // Remove device from local state
        this.devices = this.devices.filter(device => device.id !== id);
      } catch (error) {
        // Handle authentication errors
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.error = 'You must be logged in as an admin to delete devices';
          console.error('Authentication error:', error.response?.data);
        } else {
          this.error = error.response?.data?.error || error.message || 'Failed to delete device';
          console.error('Error deleting device:', error);
        }
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async uploadDeviceImage(deviceId, imageFile) {
      this.isLoading = true;
      this.error = null;
      
      try {
        // Upload the image file using the API
        const response = await api.devices.uploadImage(deviceId, imageFile);
        
        // Update the device in the local state with the new image URL
        const index = this.devices.findIndex(d => d.id === deviceId);
        if (index !== -1) {
          this.devices[index].image_url = response.data.image_url;
        }
        
        return response.data;
      } catch (error) {
        this.error = error.message || 'Failed to upload device image';
        console.error('Error uploading device image:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    }
  },
  
  getters: {
    getDeviceById: (state) => (id) => {
      return state.devices.find(device => device.id === id);
    },
    
    availableDevices: (state) => {
      // Changed to include all iPhone models including iPhone SE (2nd Gen)
      return state.devices.filter(device => device.model.includes('iPhone'));
    }
  }
});