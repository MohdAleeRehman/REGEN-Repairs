<template>
  <div>
    <!-- Admin header -->
    <header class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">REGEN Repairs Admin</h1>
        <div class="flex items-center space-x-4">
          <span v-if="authStore.user" class="text-sm text-gray-600">
            Welcome, {{ authStore.user.email }}
          </span>
          <nav class="flex space-x-4">
            <router-link 
              to="/admin" 
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="[
                $route.name === 'AdminDashboard' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/admin/submissions" 
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="[
                ($route.name === 'AdminSubmissions' || ($route.name === 'SubmissionDetail' && !$route.query.partial)) 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              Submissions
            </router-link>
            <router-link 
              to="/admin/partial-submissions" 
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="[
                $route.name === 'PartialSubmissions' || ($route.name === 'SubmissionDetail' && $route.query.partial)
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              Partial Forms
            </router-link>
            <router-link 
              to="/admin/devices" 
              class="px-3 py-2 rounded-md text-sm font-medium"
              :class="[
                $route.name === 'DeviceManagement'  
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              Devices
            </router-link>
            <button
              @click="handleLogout"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </nav>
        </div>
      </div>
    </header>

    <!-- Admin content -->
    <main>
      <div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

// Initialize authentication on component mount
onMounted(async () => {
  await authStore.initAuth();
  
  // If not authenticated, redirect to login
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    router.push('/admin/login');
  }
});

// Logout function using our Supabase auth store
const handleLogout = async () => {
  await authStore.logout();
  router.push('/admin/login');
};
</script>