<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Repair Submissions</h1>
      
      <!-- Filters -->
      <div class="flex space-x-2">
        <select 
          v-model="statusFilter"
          class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search..."
          class="block w-full rounded-md border-0 py-1.5 pl-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
        />
      </div>
    </div>
    
    <!-- Submissions Table -->
    <div class="overflow-hidden bg-white shadow sm:rounded-md">
      <div v-if="isLoading" class="p-6 text-center">
        <p class="text-gray-500">Loading submissions...</p>
      </div>
      <div v-else-if="error" class="p-6 text-center">
        <p class="text-red-500">{{ error }}</p>
        <button @click="fetchSubmissions" class="mt-2 text-primary hover:text-blue-700">
          Try Again
        </button>
      </div>
      <div v-else-if="filteredSubmissions.length === 0" class="p-6 text-center">
        <p class="text-gray-500">No submissions found.</p>
      </div>
      <ul v-else role="list" class="divide-y divide-gray-200">
        <li v-for="submission in filteredSubmissions" :key="submission.id" class="hover:bg-gray-50 transition duration-150">
          <router-link :to="`/admin/submissions/${submission.id}`" class="block">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <p class="text-sm font-medium truncate text-primary">{{ submission.name }}</p>
                  <p class="inline-flex px-2 py-0.5 text-xs font-semibold leading-5 rounded-full" :class="getStatusClass(submission.status)">
                    {{ formatStatus(submission.status) }}
                  </p>
                </div>
                <div class="flex flex-shrink-0">
                  <p class="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                    {{ submission.formatted_id || `ID: ${submission.id}` }}
                  </p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="flex items-center">
                  <!-- Device Image in a card-like container -->
                  <div class="mr-4 h-16 w-16 overflow-hidden border rounded-lg shadow-sm bg-white flex items-center justify-center">
                    <img 
                      v-if="getDeviceImage(submission.device_id)" 
                      :src="getDeviceImage(submission.device_id)" 
                      :alt="getDeviceName(submission.device_id)"
                      class="h-14 w-auto object-contain"
                      loading="lazy"
                    />
                    <div v-else class="h-16 w-16 bg-gray-50 flex items-center justify-center">
                      <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="flex flex-col">
                    <div class="flex items-center space-x-1">
                      <svg class="flex-shrink-0 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-800">{{ getDeviceName(submission.device_id) }}</span>
                    </div>
                    <div class="flex items-center space-x-1 mt-1">
                      <svg class="flex-shrink-0 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span class="text-sm text-gray-600">{{ submission.phone }}</span>
                    </div>
                  </div>
                </div>
                <div class="mt-2 sm:mt-0 text-right">
                  <div class="flex flex-col">
                    <div class="text-sm text-gray-500">
                      Submitted:
                    </div>
                    <div class="text-sm font-medium text-gray-800">
                      {{ formatDate(submission.created_at) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRepairStore } from '../../store/repairStore';
import { useDeviceStore } from '../../store/deviceStore';

const route = useRoute();
const repairStore = useRepairStore();
const deviceStore = useDeviceStore();

const isLoading = ref(false);
const error = ref(null);
const statusFilter = ref('');
const searchQuery = ref('');

// Set status filter from URL query param if it exists
onMounted(() => {
  if (route.query.status) {
    statusFilter.value = route.query.status;
  }
});

// Fetch data
const fetchSubmissions = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    await deviceStore.fetchDevices();
    await repairStore.fetchSubmissions();
  } catch (err) {
    error.value = err.message || 'Failed to load submissions';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchSubmissions);

// Filter submissions based on status and search query
const filteredSubmissions = computed(() => {
  let result = repairStore.submissions;
  
  // Filter by status
  if (statusFilter.value) {
    result = result.filter(sub => sub.status === statusFilter.value);
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(sub => 
      sub.full_name.toLowerCase().includes(query) ||
      sub.whatsapp_number.includes(query) ||
      getDeviceName(sub.device_id).toLowerCase().includes(query)
    );
  }
  
  // Sort by submission date (newest first)
  return [...result].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

// Helper functions
const getDeviceName = (deviceId) => {
  const device = deviceStore.getDeviceById(deviceId);
  return device ? device.model : 'Unknown Device';
};

// Get device image from device store
const getDeviceImage = (deviceId) => {
  const device = deviceStore.getDeviceById(deviceId);
  return device ? device.image_url : null;
};

const formatStatus = (status) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'in_progress': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>