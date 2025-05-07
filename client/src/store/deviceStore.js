import { defineStore } from 'pinia';
import { db } from '../services/supabase';

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
        const devices = await db.getDevices();
        
        // Create a model priority map based on the sequence in the data
        const modelPriorityMap = {};
        devices.forEach((device, index) => {
          modelPriorityMap[device.model] = index;
        });
        
        // Use the original sequence from the source data for sorting
        this.devices = [...devices].sort((a, b) => {
          // First sort by brand
          if (a.brand !== b.brand) {
            return a.brand.localeCompare(b.brand);
          }
          
          // Then use the priority/index for sorting models within the same brand
          const priorityA = modelPriorityMap[a.model];
          const priorityB = modelPriorityMap[b.model];
          
          return priorityA - priorityB;
        });
      } catch (error) {
        this.error = error.message || 'Failed to fetch devices';
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
        const newDevice = await db.addDevice(device);
        this.devices.push(newDevice);
        return newDevice;
      } catch (error) {
        this.error = error.message || 'Failed to add device';
        console.error('Error adding device:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async updateDevice(device) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const updatedDevice = await db.updateDevice(device);
        
        // Update device in local state
        const index = this.devices.findIndex(d => d.id === device.id);
        if (index !== -1) {
          this.devices[index] = updatedDevice;
        }
        
        return updatedDevice;
      } catch (error) {
        this.error = error.message || 'Failed to update device';
        console.error('Error updating device:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async deleteDevice(id) {
      this.isLoading = true;
      this.error = null;
      
      try {
        await db.deleteDevice(id);
        
        // Remove device from local state
        this.devices = this.devices.filter(device => device.id !== id);
      } catch (error) {
        this.error = error.message || 'Failed to delete device';
        console.error('Error deleting device:', error);
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