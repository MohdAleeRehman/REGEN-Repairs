<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">Admin Login</h1>
      
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        
        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {{ isLoading ? 'Signing in...' : 'Sign in' }}
          </button>
        </div>
      </form>
      
      <div class="mt-6 text-sm text-center text-gray-500">
        <p>Need an admin account? <router-link to="/admin/signup" class="text-blue-600 hover:text-blue-800">Sign up here</router-link></p>
        <p class="mt-2">Use your Supabase credentials to access the admin panel</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../store/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// Form state
const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = computed(() => authStore.isLoading);

// Login handler
const handleLogin = async () => {
  error.value = '';
  
  try {
    const success = await authStore.login(email.value, password.value);
    
    if (success) {
      // Redirect to the page they were trying to access or dashboard
      const redirectPath = route.query.redirect || '/admin';
      router.push(redirectPath);
    } else {
      // Check if the error is related to email confirmation
      if (authStore.error && authStore.error.includes('email')) {
        error.value = 'Please confirm your email address before logging in. Check your inbox for a confirmation link.';
      } else {
        error.value = authStore.error || 'Failed to sign in';
      }
    }
  } catch (err) {
    error.value = 'An unexpected error occurred';
    console.error(err);
  }
};
</script>