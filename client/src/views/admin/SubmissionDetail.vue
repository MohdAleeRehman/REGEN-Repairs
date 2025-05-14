<template>
  <div>
    <div v-if="isLoading" class="p-6 text-center">
      <p class="text-gray-500">Loading submission details...</p>
    </div>
    <div v-else-if="error" class="p-6 text-center">
      <p class="text-red-500">{{ error }}</p>
      <button @click="fetchSubmission" class="mt-2 text-primary hover:text-blue-700">
        Try Again
      </button>
    </div>
    <div v-else-if="!submission" class="p-6 text-center">
      <p class="text-gray-500">Submission not found.</p>
      <router-link to="/admin/submissions" class="mt-2 text-primary hover:text-blue-700">
        Back to Submissions
      </router-link>
    </div>
    <div v-else>
      <!-- Submission Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <router-link to="/admin/submissions" class="text-primary hover:text-blue-700">
            &larr; Back to Submissions
          </router-link>
          <h1 class="mt-2 text-2xl font-bold text-gray-900">
            <span v-if="submission.formatted_id" class="font-mono">{{ submission.formatted_id }}</span>
            <span v-else>Submission #{{ submission.id }}</span>
          </h1>
        </div>
        
        <!-- Status Update Dropdown -->
        <div class="relative">
          <select 
            v-model="currentStatus" 
            @change="handleStatusChange"
            class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      
      <!-- Submission Details -->
      <div class="overflow-hidden bg-white shadow sm:rounded-lg">
        <div class="flex justify-between px-4 py-5 sm:px-6">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">
              Customer Information
            </h3>
            <p class="max-w-2xl mt-1 text-sm text-gray-500">
              Personal details and repair request.
            </p>
          </div>
          <span
  class="inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-5 rounded-full"
  :class="getStatusClass(submission.status)"
>
  {{ formatStatus(submission.status) }}
</span>

        </div>
        <div class="border-t border-gray-200">
          <dl>
            <!-- Only show fields with content -->
            <div v-if="submission.name" class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Full name</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.name }}</dd>
            </div>
            
            <div v-if="submission.phone" class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">WhatsApp number</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.phone }}</dd>
            </div>
            
            <div v-if="submission.email && submission.email !== submission.phone" class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Email address</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.email }}</dd>
            </div>
            
            <div class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Device</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                <!-- Device Image with enhanced styling -->
                <div class="mr-4 h-20 w-20 flex-shrink-0 border rounded-lg shadow-sm overflow-hidden bg-white flex items-center justify-center">
                  <img 
                    v-if="deviceImage" 
                    :src="deviceImage" 
                    :alt="deviceName"
                    class="h-16 w-auto object-contain"
                  />
                  <div v-else class="h-20 w-20 bg-gray-50 flex items-center justify-center">
                    <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <span class="font-medium">{{ deviceName }}</span>
              </dd>
            </div>
            
            <div class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Repair Type</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ repairName }}</dd>
            </div>
            
            <!-- Problems and their specific options -->
            <template v-if="submission.problems && submission.problems.length > 0">
              <!-- Battery Option -->
              <div v-if="submission.problems.includes('battery') && submission.battery_option" class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Battery Option</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.battery_option }}</dd>
              </div>
              
              <!-- Display Option -->
              <div v-if="submission.problems.includes('display') && submission.display_option" class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Display Option</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.display_option }}</dd>
              </div>
              
              <!-- Include Battery with Display/Earpiece/Speaker -->
              <div v-if="(submission.problems.includes('display') || submission.problems.includes('earpiece') || submission.problems.includes('speaker')) && submission.battery_add_on" class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Include Battery</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Yes</dd>
              </div>
              
              <!-- Earpiece Option -->
              <div v-if="submission.problems.includes('earpiece') && submission.earpiece_option" class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Earpiece Option</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.earpiece_option }}</dd>
              </div>
              
              <!-- Speaker Option -->
              <div v-if="submission.problems.includes('speaker') && submission.speaker_option" class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Speaker Option</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.speaker_option }}</dd>
              </div>
              
              <!-- Charging Issue Type -->
              <div v-if="submission.problems.includes('charging') && submission.charging_issue_type" class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Charging Issue Type</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.charging_issue_type }}</dd>
              </div>
              
              <!-- Dead Phone Issue Type -->
              <div v-if="submission.problems.includes('dead') && submission.dead_phone_issue_type" class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Dead Phone Issue Type</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.dead_phone_issue_type }}</dd>
              </div>
              
              <!-- Other Problem Description -->
              <div v-if="submission.problems.includes('other') && submission.other_problem_description" class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Other Problem Description</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.other_problem_description }}</dd>
              </div>
            </template>
            
            <!-- Service History Section -->
            <div class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Previous Repairs</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.service_history === 'yes' ? 'Yes' : 'No' }}</dd>
            </div>
            
            <!-- Only show these fields if service_history is "yes" -->
            <template v-if="submission.service_history === 'yes'">
              <div v-if="submission.previous_repair_by" class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Previously Repaired By</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.previous_repair_by }}</dd>
              </div>
              
              <div v-if="submission.previous_repair_details" class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Previous Repair Details</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.previous_repair_details }}</dd>
              </div>
              
              <div v-if="submission.previous_repair_other_details" class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Additional Repair Details</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.previous_repair_other_details }}</dd>
              </div>
            </template>
            
            <!-- Location and Delivery Section -->
            <div class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">From Lahore</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.is_from_lahore ? 'Yes' : 'No' }}</dd>
            </div>
            
            <div class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Needs Pickup/Delivery</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.needs_pickup_delivery ? 'Yes' : 'No' }}</dd>
            </div>
            
            <div v-if="submission.address" class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Address</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.address }}</dd>
            </div>
            
            <div class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Submission Date</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(submission.created_at) }}</dd>
            </div>
            
            <!-- Completion Date (only shown if status is completed) -->
            <div v-if="submission.status === 'completed' && submission.completion_date" class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Completion Date</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(submission.completion_date) }}</dd>
            </div>
            
            <!-- Cancellation Date and Notes (only shown if status is cancelled) -->
            <div v-if="submission.status === 'cancelled' && submission.cancellation_date" class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Cancellation Date</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(submission.cancellation_date) }}</dd>
            </div>
            
            <div v-if="submission.status === 'cancelled' && submission.cancellation_notes" class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Cancellation Notes</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.cancellation_notes }}</dd>
            </div>
            
            <div class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Price</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatPrice(submission.calculated_price) }}</dd>
            </div>
            
            <div class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt class="text-sm font-medium text-gray-500">Agreed to Terms</dt>
              <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ submission.agreed_to_terms ? 'Yes' : 'No' }}</dd>
            </div>
          </dl>
        </div>
      </div>
      
    </div>
    
    <!-- Cancellation Notes Dialog -->
    <div v-if="showCancellationDialog" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-medium mb-4">Cancellation Notes</h3>
        <p class="text-sm text-gray-500 mb-4">Please provide a reason for cancelling this repair.</p>
        
        <textarea 
          v-model="cancellationNotes" 
          class="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
          rows="4"
          placeholder="Enter reason for cancellation..."
        ></textarea>
        
        <div class="mt-4 flex justify-end space-x-3">
          <button 
            @click="cancelCancellation" 
            class="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            Back
          </button>
          <button 
            @click="confirmCancellation" 
            class="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm text-white hover:bg-red-700"
            :disabled="!cancellationNotes.trim()"
          >
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRepairStore } from '../../store/repairStore';
import { useDeviceStore } from '../../store/deviceStore';
import api from '../../services/api';
import axios from 'axios';

// Get the API URL from environment for direct API calls
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance for direct API calls
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

const route = useRoute();
const router = useRouter();
const repairStore = useRepairStore();
const deviceStore = useDeviceStore();

const isLoading = ref(false);
const error = ref(null);
const submission = ref(null);
const currentStatus = ref('');
const isSaving = ref(false);

// For cancellation dialog
const showCancellationDialog = ref(false);
const cancellationNotes = ref('');
const previousStatus = ref('');

// Fetch submission details
const fetchSubmission = async () => {
  const id = route.params.id;
  if (!id) {
    error.value = 'Submission ID is required';
    return;
  }
  
  isLoading.value = true;
  error.value = null;
  
  try {
    await deviceStore.fetchDevices();
    
    // Try to use the store method first, but fall back to direct API call if not available
    if (typeof repairStore.fetchSubmissionById === 'function') {
      console.log("Using repairStore.fetchSubmissionById");
      await repairStore.fetchSubmissionById(id);
      submission.value = repairStore.currentSubmission;
    } else {
      // Direct API call as fallback
      console.log("Fallback: Using direct API call to fetch submission");
      const response = await api.submissions.getById(id);
      submission.value = response.data;
      // Update store for consistency if possible
      if (repairStore.currentSubmission !== undefined) {
        repairStore.currentSubmission = response.data;
      }
    }
    
    if (submission.value) {
      currentStatus.value = submission.value.status;
    }
  } catch (err) {
    console.error("Error in fetchSubmission:", err);
    error.value = err.message || 'Failed to load submission details';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchSubmission);

// Computed properties for device and repair names
const deviceName = computed(() => {
  if (!submission.value) return '';
  const device = deviceStore.getDeviceById(submission.value.device_id);
  return device ? device.model : 'Unknown Device';
});

const deviceImage = computed(() => {
  if (!submission.value) return null;
  const device = deviceStore.getDeviceById(submission.value.device_id);
  return device ? device.image_url : null;
});

const repairName = computed(() => {
  if (!submission.value) return '';
  
  // Create a user-friendly repair type based on the selected problems
  if (submission.value.problems && submission.value.problems.length > 0) {
    const problemTypes = {
      'battery': submission.value.battery_option ? `Battery Replacement (${submission.value.battery_option})` : 'Battery Replacement',
      'display': submission.value.display_option ? `Screen Replacement (${submission.value.display_option})` : 'Screen Replacement',
      'earpiece': submission.value.earpiece_option ? `Earpiece Replacement (${submission.value.earpiece_option})` : 'Earpiece Replacement',
      'speaker': submission.value.speaker_option ? `Speaker Replacement (${submission.value.speaker_option})` : 'Speaker Replacement',
      'charging': submission.value.charging_issue_type ? `Charging Issue (${submission.value.charging_issue_type})` : 'Charging Issue',
      'dead': submission.value.dead_phone_issue_type ? `Dead Phone Issue (${submission.value.dead_phone_issue_type})` : 'Dead Phone Issue',
      'other': submission.value.other_problem_description ? `Other Issue (${submission.value.other_problem_description})` : 'Other Issue',
    };
    
    // Map problems to their user-friendly names and join with commas
    return submission.value.problems
      .map(problem => problemTypes[problem] || problem)
      .join(', ');
  }
  
  return submission.value.repair_type || 'No repair type specified';
});

// Helper functions
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
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPrice = (price) => {
  if (!price) return 'N/A';
  return `Rs ${parseFloat(price).toFixed(2)}`;
};

// Handle status change
const handleStatusChange = async () => {
  if (!submission.value) return;
  
  // If status is changed to 'cancelled', show the cancellation dialog
  if (currentStatus.value === 'cancelled') {
    previousStatus.value = submission.value.status;
    showCancellationDialog.value = true;
    return;
  }
  
  // For other statuses, proceed directly
  await updateStatus();
};

// Update status
const updateStatus = async (additionalData = {}) => {
  if (!submission.value) return;
  
  try {
    await repairStore.updateSubmissionStatus(submission.value.id, currentStatus.value, additionalData);
    submission.value.status = currentStatus.value;
    
    // Update completion date or cancellation date/notes if they're in the response
    if (currentStatus.value === 'completed' && repairStore.currentSubmission.completion_date) {
      submission.value.completion_date = repairStore.currentSubmission.completion_date;
    } else if (currentStatus.value === 'cancelled') {
      if (repairStore.currentSubmission.cancellation_date) {
        submission.value.cancellation_date = repairStore.currentSubmission.cancellation_date;
      }
      if (additionalData.cancellation_notes) {
        submission.value.cancellation_notes = additionalData.cancellation_notes;
      }
    }
  } catch (err) {
    error.value = err.message || 'Failed to update status';
    // Reset to previous value on error
    currentStatus.value = submission.value.status;
  }
};

// Direct API implementation to bypass potential store issues
const confirmCancellation = async () => {
  if (!cancellationNotes.value.trim()) {
    return; // Require notes for cancellation
  }
  
  console.log("Confirming cancellation with notes:", cancellationNotes.value);
  
  try {
    isLoading.value = true;
    
    // Create the payload
    const payload = {
      status: 'cancelled',
      cancellation_notes: cancellationNotes.value
    };
    
    console.log("Sending direct API request with payload:", payload);
    
    // Make a direct API call to avoid any store transformation issues
    const submissionId = parseInt(submission.value.id, 10);
    const response = await apiClient.patch(`/submissions/${submissionId}/status`, payload);
    
    console.log("Direct API response:", response.data);
    
    // Update local state with the response data
    Object.assign(submission.value, response.data);
    
    // Explicitly set cancellation notes if they weren't returned in the response
    if (!submission.value.cancellation_notes) {
      submission.value.cancellation_notes = cancellationNotes.value;
      console.log("Manually setting cancellation notes in local state");
    }
    
    showCancellationDialog.value = false;
    cancellationNotes.value = '';
  } catch (err) {
    console.error("Error in direct API call:", err);
    error.value = err.message || 'Failed to update status';
  } finally {
    isLoading.value = false;
  }
};

const cancelCancellation = () => {
  // Reset the status to the previous value
  currentStatus.value = previousStatus.value;
  showCancellationDialog.value = false;
  cancellationNotes.value = '';
};
</script>