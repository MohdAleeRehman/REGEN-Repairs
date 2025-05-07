<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">Create Admin (Development Mode)</h1>
      
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-if="success" class="mb-4 p-3 bg-green-100 text-green-700 rounded">
        <p>{{ success }}</p>
        <p class="mt-2 text-sm">You can now <router-link to="/admin/login" class="text-blue-600 hover:text-blue-800">login</router-link> with these credentials.</p>
      </div>
      
      <form v-if="!success" @submit.prevent="handleDirectAdminCreation" class="space-y-6">
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
          <label for="devKey" class="block text-sm font-medium text-gray-700">Developer Key</label>
          <input 
            id="devKey" 
            v-model="devKey" 
            type="password" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p class="mt-1 text-xs text-gray-500">For bypassing email confirmation (development only)</p>
        </div>
        
        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {{ isLoading ? 'Creating Admin...' : 'Create Admin' }}
          </button>
        </div>
      </form>
      
      <div class="mt-6 text-center text-sm text-gray-500">
        <p>This page is for development purposes only and skips email verification.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../services/supabase';

const router = useRouter();

// Form state
const email = ref('');
const password = ref('');
const devKey = ref('');
const error = ref('');
const success = ref('');
const isLoading = ref(false);

// Developer key for bypassing email confirmation
const DEV_KEY = 'REGENDEV2025';

// Direct admin creation handler (development only)
const handleDirectAdminCreation = async () => {
  error.value = '';
  success.value = '';
  isLoading.value = true;
  
  // Verify developer key
  if (devKey.value !== DEV_KEY) {
    error.value = 'Invalid developer key';
    isLoading.value = false;
    return;
  }
  
  try {
    // Sign up with the Admin API to bypass email confirmation (only in development)
    const { data, error: signupError } = await supabase.auth.admin.createUser({
      email: email.value,
      password: password.value,
      email_confirm: true, // Skip email confirmation
      user_metadata: { role: 'admin' }
    });
    
    if (signupError) {
      // If admin API is not available, try a fallback method
      if (signupError.message.includes('Unauthorized') || signupError.message.includes('not permitted')) {
        // Fallback to regular signup with RLS bypass
        await createAdminWithoutEmail();
      } else {
        throw signupError;
      }
    } else if (data.user) {
      success.value = 'Admin account created successfully! You can now log in without email confirmation.';
      email.value = '';
      password.value = '';
      devKey.value = '';
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred while creating admin account';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// Fallback method if admin API is not available
const createAdminWithoutEmail = async () => {
  try {
    // 1. Sign up normally first
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: { role: 'admin' }
      }
    });
    
    if (signupError) throw signupError;
    
    if (!signupData.user) throw new Error('Failed to create user');
    
    // 2. Execute RLS-bypass SQL to mark the email as confirmed (development only)
    // This would normally need a server-side function with admin privileges
    // For demo/development we'll display instructions instead

    success.value = 'Account created! Since you\'re in development mode: Please log into your Supabase dashboard, go to the SQL Editor, and run this query to confirm the email:';
    error.value = `UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = '${email.value}';`;
    
  } catch (err) {
    throw err;
  }
};
</script>