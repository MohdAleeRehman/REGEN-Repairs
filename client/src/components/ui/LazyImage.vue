<template>
  <div 
    class="lazy-image-container relative overflow-hidden" 
    :style="{ paddingBottom: `${aspectRatio * 100}%`, width: '100%' }"
  >
    <!-- Blurred placeholder -->
    <div 
      v-if="showPlaceholder" 
      class="absolute inset-0 bg-gray-200 animate-pulse"
    ></div>
    
    <!-- Actual image with loading="lazy" for browser-native lazy loading -->
    <img
      ref="imageRef"
      :src="src"
      :alt="alt"
      :width="width"
      :height="height"
      loading="lazy"
      decoding="async"
      @load="onImageLoaded"
      @error="onImageError"
      class="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
      :class="{ 'opacity-0': isLoading, 'opacity-100': !isLoading }"
    />
    
    <!-- Error state -->
    <div 
      v-if="hasError" 
      class="absolute inset-0 flex items-center justify-center bg-gray-100"
    >
      <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  width: {
    type: [Number, String],
    default: 640
  },
  height: {
    type: [Number, String],
    default: 480
  }
});

const imageRef = ref(null);
const isLoaded = ref(false);
const hasError = ref(false);
const isLoading = ref(true);

// Calculate aspect ratio
const aspectRatio = computed(() => {
  return props.height / props.width;
});

const showPlaceholder = computed(() => {
  return !isLoaded.value && !hasError.value;
});

// Image loading handlers
const onImageLoaded = () => {
  isLoaded.value = true;
  isLoading.value = false;
};

const onImageError = () => {
  hasError.value = true;
  isLoading.value = false;
};

// Use intersection observer for lazy loading
onMounted(() => {
  const { stop } = useIntersectionObserver(
    imageRef,
    ([{ isIntersecting }]) => {
      if (isIntersecting) {
        // Image is in viewport, stop observing
        stop();
      }
    },
    { threshold: 0.1 }
  );
});
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
}
</style>