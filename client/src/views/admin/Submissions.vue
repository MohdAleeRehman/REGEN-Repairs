<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">{{ props.showPartial ? 'Partial Form Submissions' : 'Repair Submissions' }}</h1>
      
      <!-- Filters -->
      <div class="flex space-x-2">
        <select 
          v-if="!props.showPartial"
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
        <li v-for="submission in paginatedSubmissions" :key="submission.id" class="hover:bg-gray-50 transition duration-150">
          <router-link :to="`/admin/submissions/${submission.id}`" class="block">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex items-center space-x-2">
                    <ProfileAvatar :name="submission.name || 'Unknown'" size="sm" />
                    <p class="text-sm font-medium truncate text-primary">{{ submission.name }}</p>
                  </div>
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
      
      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div class="flex flex-1 justify-between sm:hidden">
          <button
            @click="currentPage > 1 ? currentPage-- : null"
            :disabled="currentPage <= 1"
            :class="[
              currentPage <= 1 ? 'cursor-not-allowed text-gray-300' : 'text-primary hover:text-primary-dark',
              'relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium'
            ]"
          >
            Previous
          </button>
          <button
            @click="currentPage < totalPages ? currentPage++ : null"
            :disabled="currentPage >= totalPages"
            :class="[
              currentPage >= totalPages ? 'cursor-not-allowed text-gray-300' : 'text-primary hover:text-primary-dark',
              'relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium'
            ]"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, totalItems) }}</span>
              of
              <span class="font-medium">{{ totalItems }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                @click="currentPage > 1 ? currentPage-- : null"
                :disabled="currentPage <= 1"
                class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                :class="{ 'cursor-not-allowed': currentPage <= 1 }"
              >
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <!-- Page Numbers -->
              <template v-for="page in totalPages" :key="page">
                <button
                  v-if="
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  "
                  @click="currentPage = page"
                  :class="[
                    currentPage === page
                      ? 'relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                      : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0',
                  ]"
                >
                  {{ page }}
                </button>
                <span
                  v-else-if="
                    (page === 2 && currentPage > 3) || 
                    (page === totalPages - 1 && currentPage < totalPages - 2)
                  "
                  class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                >
                  ...
                </span>
              </template>
              
              <button
                @click="currentPage < totalPages ? currentPage++ : null"
                :disabled="currentPage >= totalPages"
                class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                :class="{ 'cursor-not-allowed': currentPage >= totalPages }"
              >
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useRepairStore } from '../../store/repairStore';
import { useDeviceStore } from '../../store/deviceStore';
import ProfileAvatar from '../../components/ui/ProfileAvatar.vue';

const props = defineProps({
  showPartial: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();
const repairStore = useRepairStore();
const deviceStore = useDeviceStore();

const isLoading = ref(false);
const error = ref(null);
const statusFilter = ref('');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

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
  // Make sure we have submissions array
  let result = Array.isArray(repairStore.submissions) ? repairStore.submissions : [];
  
  // First filter by partial status (make sure props.showPartial is respected)
  result = result.filter(sub => {
    const isPartial = sub?.is_partial === true || sub?.status === 'partial';
    return isPartial === !!props.showPartial;
  });
  
  // Filter by status (only for complete submissions)
  if (!props.showPartial && statusFilter.value) {
    result = result.filter(sub => sub?.status === statusFilter.value);
  }
  
  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(sub => {
      try {
        return (
          (sub?.full_name && sub.full_name.toLowerCase().includes(query)) ||
          (sub?.name && sub.name.toLowerCase().includes(query)) ||
          (sub?.whatsapp_number && sub.whatsapp_number.includes(query)) ||
          (sub?.phone && sub.phone.includes(query)) ||
          (sub?.device_id && getDeviceName(sub.device_id).toLowerCase().includes(query))
        );
      } catch (error) {
        console.error('Error filtering submission:', error, sub);
        return false; // Skip this item if there's an error
      }
    });
  }
  
  // Sort by submission date (newest first)
  try {
    return [...result].sort((a, b) => {
      const dateA = new Date(a?.created_at || 0);
      const dateB = new Date(b?.created_at || 0);
      return dateB - dateA;
    });
  } catch (error) {
    console.error('Error sorting submissions:', error);
    return result;
  }
});

// Calculate pagination
const totalItems = computed(() => filteredSubmissions.value.length);
const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value));

// Get paginated results
const paginatedSubmissions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredSubmissions.value.slice(start, end);
});

// Helper functions
const getDeviceName = (deviceId) => {
  if (!deviceId) return 'Unknown Device';
  try {
    const device = deviceStore.getDeviceById(deviceId);
    return device?.model || 'Unknown Device';
  } catch (error) {
    console.error('Error getting device name:', error);
    return 'Unknown Device';
  }
};

// Get device image from device store
const getDeviceImage = (deviceId) => {
  if (!deviceId) return null;
  try {
    const device = deviceStore.getDeviceById(deviceId);
    return device?.image_url || null;
  } catch (error) {
    console.error('Error getting device image:', error);
    return null;
  }
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
  try {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return 'Error formatting date';
  }
};
</script>