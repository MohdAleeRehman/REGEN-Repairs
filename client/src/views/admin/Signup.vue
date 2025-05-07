<template>
  <div class="min-h-[80vh] flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold text-center mb-6">Admin Signup</h1>
      
      <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>

      <div v-if="success" class="mb-4 p-3 bg-green-100 text-green-700 rounded">
        <p>{{ success }}</p>
        <p class="mt-2 text-sm">You can now <router-link to="/admin/login" class="text-blue-600 hover:text-blue-800">login</router-link> with these credentials.</p>
      </div>
      
      <form v-if="!success" @submit.prevent="handleSignup" class="space-y-6">
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
          <label for="adminCode" class="block text-sm font-medium text-gray-700">Admin Code</label>
          <input 
            id="adminCode" 
            v-model="adminCode" 
            type="password" 
            required 
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          />
          <p class="mt-1 text-xs text-gray-500">Enter the admin registration code</p>
        </div>
        
        <div>
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {{ isLoading ? 'Signing up...' : 'Sign up' }}
          </button>
        </div>
      </form>
      
      <div class="mt-6 text-center text-sm text-gray-500">
        <p>Already have an account? <router-link to="/admin/login" class="text-blue-600 hover:text-blue-800">Login</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../../services/supabase';
import axios from 'axios';

const router = useRouter();

// Form state
const email = ref('');
const password = ref('');
const adminCode = ref('');
const error = ref('');
const success = ref('');
const isLoading = ref(false);

// Admin registration code
const ADMIN_CODE = 'REGEN2025';

// Server API URL (could be moved to an environment variable)
const API_URL = 'http://localhost:3000/api';

// Signup handler
const handleSignup = async () => {
  error.value = '';
  success.value = '';
  isLoading.value = true;
  
  // Verify admin code
  if (adminCode.value !== ADMIN_CODE) {
    error.value = 'Invalid admin code';
    isLoading.value = false;
    return;
  }
  
  try {
    // Method 1: Try using the server's create-admin endpoint (preferred)
    try {
      const response = await axios.post(`${API_URL}/auth/create-admin`, {
        email: email.value,
        password: password.value,
        admin_code: adminCode.value
      });
      
      if (response.data.status === 'success') {
        success.value = 'Admin account created successfully! You can now log in.';
        email.value = '';
        password.value = '';
        adminCode.value = '';
        isLoading.value = false;
        return;
      }
    } catch (serverError) {
      console.log('Server create-admin failed, falling back to client-side method', serverError);
      // Continue to fallback method
    }
    
    // Method 2: Fallback - Create user with Supabase client and confirm via API
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: { role: 'admin' }
      }
    });
    
    if (signupError) throw signupError;
    if (!signupData.user) throw new Error('Failed to create user');
    
    // Now call the server API to confirm the email
    const userId = signupData.user.id;
    try {
      const confirmResponse = await axios.post(`${API_URL}/auth/confirm-email`, {
        user_id: userId
      });
      
      if (confirmResponse.data.status === 'success') {
        success.value = 'Admin account created successfully! You can now log in.';
        email.value = '';
        password.value = '';
        adminCode.value = '';
      } else {
        throw new Error('Email confirmation failed');
      }
    } catch (confirmError) {
      console.error('Failed to confirm email via API:', confirmError);
      
      // Fallback message if server confirmation fails
      success.value = 'Account created, but automatic confirmation failed.';
      error.value = `Please run this SQL in Supabase: UPDATE auth.users SET email_confirmed_at = NOW() WHERE id = '${userId}';`;
    }
  } catch (err) {
    error.value = err.message || 'An unexpected error occurred during signup';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>