<template>
  <div>
    <!-- Dashboard Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      <!-- Pending Submissions Card -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pending Submissions</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ pendingCount }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 bg-gray-50">
          <router-link to="/admin/submissions?status=pending" class="text-sm font-medium text-primary hover:text-blue-700">
            View all
          </router-link>
        </div>
      </div>

      <!-- In Progress Card -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
              </svg>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ inProgressCount }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 bg-gray-50">
          <router-link to="/admin/submissions?status=in_progress" class="text-sm font-medium text-primary hover:text-blue-700">
            View all
          </router-link>
        </div>
      </div>

      <!-- Completed Card -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Completed</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ completedCount }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 bg-gray-50">
          <router-link to="/admin/submissions?status=completed" class="text-sm font-medium text-primary hover:text-blue-700">
            View all
          </router-link>
        </div>
      </div>

      <!-- Partial Submissions Card -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Partial Submissions</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ partialCount }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 bg-gray-50">
          <router-link to="/admin/submissions?status=partial" class="text-sm font-medium text-primary hover:text-blue-700">
            View all
          </router-link>
        </div>
      </div>
      
      <!-- Devices Card -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Devices</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ deviceStore.devices.length }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 bg-gray-50">
          <router-link to="/admin/devices" class="text-sm font-medium text-primary hover:text-blue-700">
            Manage devices
          </router-link>
        </div>
      </div>
    </div>

    <!-- Admin Actions -->
    <div class="grid grid-cols-1 gap-5 mt-8 sm:grid-cols-2">
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <h3 class="mb-2 text-lg font-medium text-gray-900">Device Management</h3>
          <p class="mb-4 text-sm text-gray-500">Add, edit, or remove devices and manage their pricing.</p>
          <router-link 
            to="/admin/devices" 
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-blue-700"
          >
            Manage Devices
          </router-link>
        </div>
      </div>
      
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <h3 class="mb-2 text-lg font-medium text-gray-900">Repair Submissions</h3>
          <p class="mb-4 text-sm text-gray-500">View and manage all customer repair submissions.</p>
          <router-link 
            to="/admin/submissions" 
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-blue-700"
          >
            View Submissions
          </router-link>
        </div>
      </div>
    </div>

    <!-- Recent Submissions -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900">Recent Submissions</h2>
      <div class="mt-4 overflow-hidden bg-white rounded-lg shadow">
        <div v-if="isLoading" class="p-6 text-center">
          <p class="text-gray-500">Loading...</p>
        </div>
        <div v-else-if="error" class="p-6 text-center">
          <p class="text-red-500">{{ error }}</p>
        </div>
        <div v-else-if="recentSubmissions.length === 0" class="p-6 text-center">
          <p class="text-gray-500">No recent submissions found.</p>
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Device
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Date
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="submission in recentSubmissions" :key="submission.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ submission.name }}</div>
                <div class="text-sm text-gray-500">{{ submission.whatsapp_number }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getDeviceName(submission.device_id) }}</div>
                <div class="text-sm text-gray-500">
                  {{ submission.problems.join(', ') }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full" :class="getStatusClass(submission.status)">
                  {{ formatStatus(submission.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {{ formatDate(submission.created_at) }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                <router-link :to="`/admin/submissions/${submission.id}`" class="text-primary hover:text-blue-900">
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="px-4 py-3 text-center bg-gray-50 sm:px-6">
          <router-link to="/admin/submissions" class="text-sm font-medium text-primary hover:text-blue-700">
            View all submissions
          </router-link>
        </div>
      </div>
    </div>

    <!-- Partial Submissions -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900">Partial Submissions</h2>
      <p class="mt-1 text-sm text-gray-500">Users who started but didn't complete the form</p>
      <div class="mt-4 overflow-hidden bg-white rounded-lg shadow">
        <div v-if="isLoading" class="p-6 text-center">
          <p class="text-gray-500">Loading...</p>
        </div>
        <div v-else-if="error" class="p-6 text-center">
          <p class="text-red-500">{{ error }}</p>
        </div>
        <div v-else-if="recentPartialSubmissions.length === 0" class="p-6 text-center">
          <p class="text-gray-500">No partial submissions found.</p>
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Device
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Last Completed Step
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Problems
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Date
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="submission in recentPartialSubmissions" :key="submission.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getDeviceName(submission.device_id) }}</div>
                <div v-if="submission.whatsapp_number" class="text-sm text-gray-500">
                  {{ submission.whatsapp_number }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium">
                  Step {{ submission.last_completed_step }} of 5
                </div>
                <div class="text-xs text-gray-500">
                  {{ getStepName(submission.last_completed_step) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="submission.problems && submission.problems.length > 0" class="text-sm text-gray-500">
                  {{ submission.problems.join(', ') }}
                </div>
                <div v-else class="text-xs text-gray-400 italic">
                  No problems selected
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {{ formatDate(submission.created_at) }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                <router-link :to="`/admin/submissions/${submission.id}`" class="text-primary hover:text-blue-900">
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="px-4 py-3 text-center bg-gray-50 sm:px-6">
          <router-link to="/admin/submissions?status=partial" class="text-sm font-medium text-primary hover:text-blue-700">
            View all partial submissions
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRepairStore } from '../../store/repairStore';
import { useDeviceStore } from '../../store/deviceStore';

const repairStore = useRepairStore();
const deviceStore = useDeviceStore();

const isLoading = ref(false);
const error = ref(null);
const submissions = ref([]);

// Fetch data
onMounted(async () => {
  isLoading.value = true;
  try {
    await deviceStore.fetchDevices();
    await repairStore.fetchSubmissions();
    submissions.value = repairStore.submissions;
  } catch (err) {
    error.value = err.message || 'Failed to load data';
  } finally {
    isLoading.value = false;
  }
});

// Calculate counts
const pendingCount = computed(() => {
  return submissions.value.filter(sub => sub.status === 'pending').length;
});

const inProgressCount = computed(() => {
  return submissions.value.filter(sub => sub.status === 'in_progress').length;
});

const completedCount = computed(() => {
  return submissions.value.filter(sub => sub.status === 'completed').length;
});

// Count for partial submissions
const partialCount = computed(() => {
  return submissions.value.filter(sub => sub.status === 'partial' || sub.is_partial === true).length;
});

// Get recent submissions (5 most recent complete ones)
const recentSubmissions = computed(() => {
  return [...submissions.value]
    .filter(sub => sub.status !== 'partial' && !sub.is_partial)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
});

// Get recent partial submissions (5 most recent partial ones)
const recentPartialSubmissions = computed(() => {
  return [...submissions.value]
    .filter(sub => sub.status === 'partial' || sub.is_partial === true)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);
});

// Helper functions
const getDeviceName = (deviceId) => {
  const device = deviceStore.getDeviceById(deviceId);
  return device ? device.model : 'Unknown Device';
};

const formatStatus = (status) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    case 'partial': return 'Partial';
    default: return status;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'in_progress': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'partial': return 'bg-orange-100 text-orange-800';
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

// Get the name of the step from step number
const getStepName = (stepNumber) => {
  const stepNames = [
    'Device Selection',
    'Problem Selection',
    'Problem Details',
    'Service History',
    'Contact & Terms'
  ];
  
  return stepNames[stepNumber - 1] || 'Unknown Step';
};
</script>