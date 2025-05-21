<template>
  <div class="max-w-2xl px-4 py-12 mx-auto text-center sm:px-6 lg:px-8">
    <div class="p-8 bg-white rounded-lg shadow-md">
      <div class="mb-6">
        <div class="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
          <svg class="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <h1 class="mb-4 text-3xl font-bold text-gray-900">Request Submitted Successfully!</h1>
      
      <p class="mb-6 text-lg text-gray-600">
        Thank you for choosing REGEN. We've received your repair request and will contact you shortly via WhatsApp to confirm the details.
      </p>
      
      <div class="py-4 my-6 border-t border-b border-gray-200">
        <h2 class="mb-2 text-xl font-semibold">What's Next?</h2>
        <ul class="max-w-md mx-auto space-y-2 text-left text-gray-600">
          <li class="flex items-start">
            <span class="flex-shrink-0 w-5 h-5 mr-2 text-green-500">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Our team will contact you via WhatsApp within 1-2 hours to confirm your request
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 w-5 h-5 mr-2 text-green-500">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Ensure your data is completely backed up before handing over your device
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 w-5 h-5 mr-2 text-green-500">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            Our technician will diagnose and repair your device
          </li>
          <li class="flex items-start">
            <span class="flex-shrink-0 w-5 h-5 mr-2 text-green-500">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            We will notify you once the repair is complete
          </li>
        </ul>
      </div>
      
      <div v-if="formattedSubmissionId" class="p-4 mb-6 rounded-md bg-gray-50">
        <p class="text-sm text-gray-600">
          Your request reference ID: <span class="font-mono font-semibold">{{ formattedSubmissionId }}</span>
        </p>
      </div>
      <!-- Fallback to numeric ID if formatted ID isn't available -->
      <div v-else-if="submissionId" class="p-4 mb-6 rounded-md bg-gray-50">
        <p class="text-sm text-gray-600">
          Your request reference ID: <span class="font-mono font-semibold">{{ submissionId }}</span>
        </p>
      </div>
      
      <div class="mt-6">
        <router-link 
          to="/" 
          class="inline-flex items-center px-6 py-3 text-base font-medium text-white border border-transparent rounded-md bg-primary hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Return to Home
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRepairStore } from '../store/repairStore';
import { computed } from 'vue';

const repairStore = useRepairStore();
const submissionId = computed(() => repairStore.submissionId);
const formattedSubmissionId = computed(() => repairStore.formattedSubmissionId);
</script>