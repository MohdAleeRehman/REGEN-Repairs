<template>
  <div class="px-2 mb-4 sm:mb-8 sm:px-0">
    <!-- Step Tracker -->
    <div class="relative flex items-center justify-between">
      <!-- Connector Line Background (single continuous line) -->
      <div class="absolute left-0 right-0 h-1 -translate-y-1/2 bg-gray-200 top-1/2" aria-hidden="true"></div>
      
      <!-- Active Line Overlay (grows based on current step) -->
      <div 
        class="absolute left-0 h-1 transition-all duration-300 -translate-y-1/2 top-1/2 bg-primary"
        :style="{ width: `${(currentStep - 1) / (steps.length - 1) * 100}%` }"
        aria-hidden="true"
      ></div>
      
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="relative flex justify-center flex-1"
      >
        <!-- Step Circle/Indicator -->
        <div class="relative z-10 flex justify-center group">
          <span
            class="flex items-center justify-center w-6 h-6 text-xs font-semibold transition-all duration-300 rounded-full shadow-md xs:w-8 xs:h-8 sm:w-10 sm:h-10 xs:text-sm"
            :class="[
              currentStep > index + 1 
                ? 'bg-primary text-white ring-2 xs:ring-4 ring-blue-100 scale-105 sm:scale-110' 
                : currentStep === index + 1
                  ? 'bg-primary text-white ring-2 xs:ring-4 ring-blue-100 animate-pulse-subtle'
                  : 'bg-white text-gray-500 border border-gray-200',
            ]"
          >
            <svg v-if="currentStep > index + 1" class="w-3 h-3 text-white xs:w-4 xs:h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span v-else class="text-xs xs:text-sm">{{ index + 1 }}</span>
          </span>
        </div>
      </div>
    </div>
    
    <!-- Step Labels - Mobile Optimized -->
    <div class="hidden sm:grid sm:mt-4" :style="{ 'grid-template-columns': `repeat(${steps.length}, 1fr)` }">
      <div 
        v-for="(step, index) in steps" 
        :key="`desktop-label-${index}`"
        class="text-xs font-medium text-center transition-all duration-300 xs:text-sm"
        :class="[
          currentStep > index 
            ? 'text-primary font-semibold' 
            : currentStep === index + 1
              ? 'text-primary font-semibold'
              : 'text-gray-500',
        ]"
      >
        <span class="block px-0.5 xs:px-1 truncate md:whitespace-normal">{{ step }}</span>
      </div>
    </div>

    <!-- Mobile-only visible active step label -->
    <div class="mt-2 text-center sm:hidden">
      <span 
        class="inline-block px-2 py-1 text-sm font-semibold rounded-full text-primary bg-blue-50"
      >
        {{ steps[currentStep - 1] }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  }
});
</script>

<style scoped>
@keyframes pulse-subtle {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

.animate-pulse-subtle {
  animation: pulse-subtle 2s infinite;
}

/* Add tailwind utility for extra small screens */
@media (min-width: 400px) {
  .xs\:w-8 {
    width: 2rem;
  }
  .xs\:h-8 {
    height: 2rem;
  }
  .xs\:w-4 {
    width: 1rem;
  }
  .xs\:h-4 {
    height: 1rem;
  }
  .xs\:text-sm {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  .xs\:ring-4 {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(4px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  }
  .xs\:px-1 {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
}
</style>