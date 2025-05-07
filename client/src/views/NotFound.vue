<template>
  <div class="max-w-lg mx-auto text-center py-12">
    <div class="text-6xl font-bold text-primary mb-4">404</div>
    <h1 class="text-3xl font-bold mb-6">Page Not Found</h1>
    
    <p class="text-lg text-gray-600 mb-8">
      The page you are looking for doesn't exist or has been moved.
    </p>
    
    <router-link 
      to="/" 
      class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Return to Home
    </router-link>
  </div>
</template>

<script setup>
// No script needed for this component
</script>