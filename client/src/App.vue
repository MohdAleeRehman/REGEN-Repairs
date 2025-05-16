<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <header class="bg-white shadow-md">
      <nav class="container flex items-center justify-between px-4 py-4 mx-auto">
        <router-link to="/" class="flex items-center">
          <div class="relative w-auto h-10 overflow-hidden">
            <img src="/assets/regen.svg" alt="REGEN Repairs" width="40" height="40" class="object-contain w-auto h-10" />
          </div>
        </router-link>
        <div class="flex gap-3">
          <router-link to="/" class="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-700">Home</router-link>
          <router-link to="/repair-form" class="px-4 py-2 text-white rounded-lg bg-gradient-to-r from-blue-500 to-blue-700">Repair Form</router-link>
          <!-- Admin link removed as requested - will be accessible via direct URL only -->
        </div>
      </nav>
    </header>
    
    <main class="container flex-grow px-4 py-6 mx-auto">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <footer class="relative overflow-hidden text-white bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
      <!-- Wave pattern overlay with fixed dimensions -->
      <div class="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="absolute bottom-0 w-full h-32" width="1440" height="320" aria-hidden="true">
          <path fill="#ffffff" fill-opacity="1" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" class="absolute top-0 w-full h-32 rotate-180" width="1440" height="320" aria-hidden="true">
          <path fill="#ffffff" fill-opacity="1" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,144C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div class="container relative z-10 px-6 pt-12 pb-8 mx-auto">
        <!-- Footer content with dimensions -->
        <div class="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3 lg:grid-cols-4" style="min-height: 220px">
          <!-- Company info -->
          <div class="md:col-span-1 lg:col-span-1">
            <p class="mb-4 text-sm leading-relaxed text-blue-200">
              We provide professional iPhone repair services using premium quality parts and certified technicians. 
              From screen replacements and battery issues to water damage and diagnostics, our team ensures fast, 
              reliable, and affordable repairs. Customer satisfaction is our top priority, and all repairs come with 
              a limited warranty for peace of mind.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="relative mb-4 text-lg font-semibold">
              <span class="relative z-10">Quick Links</span>
              <span class="absolute bottom-0 left-0 w-10 h-1 bg-blue-400 rounded-full"></span>
            </h3>
            <ul class="space-y-2 text-blue-200">
              <li>
                <router-link to="/" class="flex items-center transition-colors duration-300 hover:text-white">
                  <svg class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  Home
                </router-link>
              </li>
              <li>
                <router-link to="/repair-form" class="flex items-center transition-colors duration-300 hover:text-white">
                  <svg class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  Repair Form
                </router-link>
              </li>
              <li>
                <router-link to="/terms" class="flex items-center transition-colors duration-300 hover:text-white">
                  <svg class="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                  Terms & Conditions
                </router-link>
              </li>
            </ul>
          </div>

          <!-- Services -->
          <div>
            <h3 class="relative mb-4 text-lg font-semibold">
              <span class="relative z-10">Our Services</span>
              <span class="absolute bottom-0 left-0 w-10 h-1 bg-blue-400 rounded-full"></span>
            </h3>
            <ul class="space-y-2 text-blue-200">
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Screen Replacement</span>
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Battery Replacement</span>
              </li>
              <li class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Speaker & Audio Repairs</span>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="relative mb-4 text-lg font-semibold">
              <span class="relative z-10">Contact Us</span>
              <span class="absolute bottom-0 left-0 w-10 h-1 bg-blue-400 rounded-full"></span>
            </h3>
            <ul class="space-y-3 text-blue-200">
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-2 mt-0.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>297 St 10, Sector Y, DHA Phase 3, Lahore</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-2 mt-0.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>support@regen.pk</span>
              </li>
              <li class="flex items-start">
                <svg class="w-5 h-5 mr-2 mt-0.5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>+92-311-100-5569</span>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- Footer bottom -->
        <div class="pt-6 mt-6 border-t border-blue-800/50">
          <div class="flex flex-col items-center md:flex-row md:justify-between">
            <p class="mb-4 text-sm text-blue-200 md:mb-0">
              &copy; {{ new Date().getFullYear() }} REGEN. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Decoration elements -->
      <div class="absolute bottom-0 right-0 w-32 h-32 -mb-16 -mr-16 rounded-full md:w-48 md:h-48 bg-gradient-to-tl from-blue-400/20 to-transparent"></div>
      <div class="absolute top-0 left-0 w-24 h-24 -mt-12 -ml-12 rounded-full md:w-32 md:h-32 bg-gradient-to-br from-blue-400/20 to-transparent"></div>
    </footer>
  </div>
</template>

<script setup>
// No additional script needed at this level
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
