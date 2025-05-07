<template>
  <div class="px-4 py-6 md:p-8">
    <div class="flex flex-col mb-8 md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl font-bold text-gray-800">Device Management</h1>
      <button 
        @click="openAddDeviceModal()" 
        class="mt-4 md:mt-0 px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 flex items-center justify-center transition duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add New Device
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="deviceStore.isLoading" class="py-10 text-center">
      <div class="inline-block w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      <p class="mt-2 text-gray-600">Loading devices...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="deviceStore.error" class="px-4 py-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
      <p>{{ deviceStore.error }}</p>
      <button 
        @click="deviceStore.fetchDevices()" 
        class="px-4 py-2 mt-4 text-red-700 border border-red-300 rounded-md hover:bg-red-100"
      >
        Try Again
      </button>
    </div>

    <!-- Devices List -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full overflow-hidden bg-white border border-gray-200 rounded-lg shadow-md">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Brand</th>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Model</th>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
            <th class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="device in deviceStore.devices" :key="device.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">{{ device.brand }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ device.model }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ device.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex space-x-2">
                <button 
                  @click="openEditDeviceModal(device)" 
                  class="text-blue-600 transition duration-200 hover:text-blue-900"
                  title="Edit Device"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button 
                  @click="openEditPricesModal(device)"
                  class="text-green-600 transition duration-200 hover:text-green-900"
                  title="Edit Repair Prices"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button 
                  @click="confirmDelete(device)" 
                  class="text-red-600 transition duration-200 hover:text-red-900"
                  title="Delete Device"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Device Modal -->
    <div 
      v-if="showModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h2 class="mb-6 text-xl font-bold">{{ editingDevice ? 'Edit Device' : 'Add New Device' }}</h2>
        
        <form @submit.prevent="saveDevice">
          <div class="mb-4">
            <label for="brand" class="block mb-1 text-sm font-medium text-gray-700">Brand</label>
            <input 
              type="text" 
              id="brand" 
              v-model="deviceForm.brand" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., Apple"
            />
          </div>
          
          <div class="mb-4">
            <label for="model" class="block mb-1 text-sm font-medium text-gray-700">Model</label>
            <input 
              type="text" 
              id="model" 
              v-model="deviceForm.model" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., iPhone 15 Pro"
            />
          </div>
          
          <div class="mb-4">
            <label for="type" class="block mb-1 text-sm font-medium text-gray-700">Type</label>
            <input 
              type="text" 
              id="type" 
              v-model="deviceForm.type" 
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="e.g., smartphone"
            />
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="closeModal"
              class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            
            <button 
              type="submit"
              class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting" class="inline-block w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent"></span>
              {{ editingDevice ? 'Update' : 'Add' }} Device
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Prices Modal -->
    <div 
      v-if="showPricesModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div class="w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">Edit Repair Prices - {{ currentDevice?.model }}</h2>
          <button @click="closePricesModal" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div v-if="isLoadingRepairs" class="py-10 text-center">
          <div class="inline-block w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
          <p class="mt-2 text-gray-600">Loading repair options...</p>
        </div>
        
        <div v-else>
          <form @submit.prevent="saveRepairPrices">
            <!-- Battery Repair Prices -->
            <div class="p-4 mb-6 border border-gray-200 rounded-lg">
              <h3 class="mb-4 text-lg font-semibold">Battery Replacement</h3>
              
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="block mb-1 text-sm font-medium text-gray-700">OEM Battery</label>
                  <div class="flex">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">Rs.</span>
                    <input 
                      type="number" 
                      v-model="pricesForm.battery.OEM" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label class="block mb-1 text-sm font-medium text-gray-700">Aftermarket Battery</label>
                  <div class="flex">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">Rs.</span>
                    <input 
                      type="number" 
                      v-model="pricesForm.battery.Aftermarket" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Display Repair Prices -->
            <div class="p-4 mb-6 border border-gray-200 rounded-lg">
              <h3 class="mb-4 text-lg font-semibold">Display Replacement</h3>
              
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label class="block mb-1 text-sm font-medium text-gray-700">OEM Display</label>
                  <div class="flex">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">Rs.</span>
                    <input 
                      type="number" 
                      v-model="pricesForm.display.OEM" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label class="block mb-1 text-sm font-medium text-gray-700">Aftermarket Display</label>
                  <div class="flex">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">Rs.</span>
                    <input 
                      type="number" 
                      v-model="pricesForm.display.Aftermarket" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Earpiece & Speaker Prices -->
            <div class="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2">
              <!-- Earpiece Repair Price -->
              <div class="p-4 border border-gray-200 rounded-lg">
                <h3 class="mb-4 text-lg font-semibold">Earpiece Replacement</h3>
                
                <div>
                  <label class="block mb-1 text-sm font-medium text-gray-700">OEM Earpiece</label>
                  <div class="flex">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">Rs.</span>
                    <input 
                      type="number" 
                      v-model="pricesForm.earpiece.OEM" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <!-- Speaker Repair Price -->
              <div class="p-4 border border-gray-200 rounded-lg">
                <h3 class="mb-4 text-lg font-semibold">Speaker Replacement</h3>
                
                <div>
                  <label class="block mb-1 text-sm font-medium text-gray-700">OEM Speaker</label>
                  <div class="flex">
                    <span class="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">Rs.</span>
                    <input 
                      type="number" 
                      v-model="pricesForm.speaker.OEM" 
                      class="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end space-x-3">
              <button 
                type="button" 
                @click="closePricesModal"
                class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              
              <button 
                type="submit"
                class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="isSubmittingPrices"
              >
                <span v-if="isSubmittingPrices" class="inline-block w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent"></span>
                Save Prices
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        <h2 class="mb-2 text-xl font-bold">Confirm Delete</h2>
        <p class="mb-6 text-gray-600">
          Are you sure you want to delete <span class="font-semibold">{{ deviceToDelete?.brand }} {{ deviceToDelete?.model }}</span>? 
          This action cannot be undone.
        </p>
        
        <div class="flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          
          <button 
            @click="deleteDevice"
            class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="isDeleting"
          >
            <span v-if="isDeleting" class="inline-block w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent"></span>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useDeviceStore } from '@/store/deviceStore';
import { useRepairStore } from '@/store/repairStore';
import api from '@/services/api';

export default {
  name: 'DeviceManagement',
  
  setup() {
    const deviceStore = useDeviceStore();
    const repairStore = useRepairStore();
    const showModal = ref(false);
    const showPricesModal = ref(false);
    const showDeleteModal = ref(false);
    const editingDevice = ref(null);
    const deviceToDelete = ref(null);
    const currentDevice = ref(null);
    const isSubmitting = ref(false);
    const isSubmittingPrices = ref(false);
    const isDeleting = ref(false);
    const isLoadingRepairs = ref(false);
    
    const defaultFormState = {
      brand: '',
      model: '',
      type: ''
    };
    
    const defaultPricesFormState = {
      battery: {
        OEM: 0,
        Aftermarket: 0
      },
      display: {
        OEM: 0,
        Aftermarket: 0
      },
      earpiece: {
        OEM: 0
      },
      speaker: {
        OEM: 0
      }
    };
    
    const deviceForm = reactive({...defaultFormState});
    const pricesForm = reactive({...defaultPricesFormState});
    
    onMounted(() => {
      deviceStore.fetchDevices();
    });
    
    // Modal handlers
    function openAddDeviceModal() {
      // Reset form
      Object.assign(deviceForm, defaultFormState);
      editingDevice.value = null;
      showModal.value = true;
    }
    
    function openEditDeviceModal(device) {
      editingDevice.value = device;
      
      // Populate form with device data
      Object.assign(deviceForm, {
        brand: device.brand,
        model: device.model,
        type: device.type
      });
      
      showModal.value = true;
    }
    
    function closeModal() {
      showModal.value = false;
    }
    
    // Device Actions
    async function saveDevice() {
      isSubmitting.value = true;
      
      try {
        if (editingDevice.value) {
          // Update existing device
          await deviceStore.updateDevice({
            id: editingDevice.value.id,
            ...deviceForm
          });
        } else {
          // Add new device
          await deviceStore.addDevice(deviceForm);
        }
        
        closeModal();
      } catch (error) {
        console.error('Error saving device:', error);
        // Show error notification
      } finally {
        isSubmitting.value = false;
      }
    }
    
    function confirmDelete(device) {
      deviceToDelete.value = device;
      showDeleteModal.value = true;
    }
    
    async function deleteDevice() {
      if (!deviceToDelete.value) return;
      
      isDeleting.value = true;
      
      try {
        await deviceStore.deleteDevice(deviceToDelete.value.id);
        showDeleteModal.value = false;
      } catch (error) {
        console.error('Error deleting device:', error);
        // Show error notification
      } finally {
        isDeleting.value = false;
      }
    }
    
    // Repair Prices Modal Handlers
    async function openEditPricesModal(device) {
      currentDevice.value = device;
      isLoadingRepairs.value = true;
      showPricesModal.value = true;
      
      try {
        // Fetch existing repair prices for this device
        await repairStore.fetchPricingData();
        const deviceModel = device.model;
        
        // Reset form with default values first
        Object.assign(pricesForm, JSON.parse(JSON.stringify(defaultPricesFormState)));
        
        // Populate with existing prices if available
        if (repairStore.pricingData[deviceModel]) {
          const pricing = repairStore.pricingData[deviceModel];
          
          if (pricing.battery) {
            pricesForm.battery.OEM = pricing.battery.OEM || 0;
            pricesForm.battery.Aftermarket = pricing.battery.Aftermarket || 0;
          }
          
          if (pricing.display) {
            pricesForm.display.OEM = pricing.display.OEM || 0;
            pricesForm.display.Aftermarket = pricing.display.Aftermarket || 0;
          }
          
          if (pricing.earpiece) {
            pricesForm.earpiece.OEM = pricing.earpiece.OEM || 0;
          }
          
          if (pricing.speaker) {
            pricesForm.speaker.OEM = pricing.speaker.OEM || 0;
          }
        }
      } catch (error) {
        console.error('Error loading repair prices:', error);
      } finally {
        isLoadingRepairs.value = false;
      }
    }
    
    function closePricesModal() {
      showPricesModal.value = false;
      currentDevice.value = null;
    }
    
    async function saveRepairPrices() {
      if (!currentDevice.value) return;
      
      isSubmittingPrices.value = true;
      
      try {
        // Construct the updated pricing data
        const updatedPricing = {
          deviceId: currentDevice.value.id,
          model: currentDevice.value.model,
          prices: {
            battery: {
              OEM: Number(pricesForm.battery.OEM),
              Aftermarket: Number(pricesForm.battery.Aftermarket)
            },
            display: {
              OEM: Number(pricesForm.display.OEM),
              Aftermarket: Number(pricesForm.display.Aftermarket)
            },
            earpiece: {
              OEM: Number(pricesForm.earpiece.OEM)
            },
            speaker: {
              OEM: Number(pricesForm.speaker.OEM)
            }
          }
        };
        
        // Use API to update repair prices
        await api.repairs.updatePrices(updatedPricing);
        
        // Update local store
        await repairStore.fetchPricingData();
        
        // Close modal
        closePricesModal();
      } catch (error) {
        console.error('Error saving repair prices:', error);
      } finally {
        isSubmittingPrices.value = false;
      }
    }
    
    return {
      deviceStore,
      repairStore,
      showModal,
      showPricesModal,
      showDeleteModal,
      editingDevice,
      deviceToDelete,
      currentDevice,
      deviceForm,
      pricesForm,
      isSubmitting,
      isSubmittingPrices,
      isDeleting,
      isLoadingRepairs,
      openAddDeviceModal,
      openEditDeviceModal,
      closeModal,
      saveDevice,
      confirmDelete,
      deleteDevice,
      openEditPricesModal,
      closePricesModal,
      saveRepairPrices
    };
  }
};
</script>