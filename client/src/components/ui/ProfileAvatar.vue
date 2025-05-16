<template>
  <div :class="['flex items-center justify-center rounded-full overflow-hidden', sizeClasses, bgColorClass]">
    <span v-if="!imageUrl" :class="['font-medium text-white', textSizeClass]">{{ initials }}</span>
    <img v-else :src="imageUrl" :alt="name" class="object-cover w-full h-full">
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'md', // 'sm', 'md', 'lg'
    validator: value => ['sm', 'md', 'lg'].includes(value)
  }
});

// Extract initials from name
const initials = computed(() => {
  if (!props.name) return '';
  
  const nameParts = props.name.split(' ').filter(part => part.length > 0);
  
  if (nameParts.length === 0) return '';
  
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
});

// Generate a consistent color based on the name
const bgColorClass = computed(() => {
  if (props.imageUrl) return '';
  
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ];
  
  // Hash function to consistently map a name to a color
  let hash = 0;
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
});

// Size classes based on the size prop
const sizeClasses = computed(() => {
  switch(props.size) {
    case 'sm':
      return 'w-6 h-6';
    case 'lg':
      return 'w-10 h-10';
    case 'md':
    default:
      return 'w-8 h-8';
  }
});

const textSizeClass = computed(() => {
  switch(props.size) {
    case 'sm':
      return 'text-xs';
    case 'lg':
      return 'text-base';
    case 'md':
    default:
      return 'text-sm';
  }
});
</script>
