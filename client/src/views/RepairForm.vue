<template>
  <div class="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
    <h1 class="mb-6 text-3xl font-bold text-center">iPhone Repair Request Form</h1>
    
    <StepIndicator 
      :steps="steps" 
      :currentStep="repairStore.currentStep" 
    />
    
    <!-- Step 1: Device Selection -->
    <div v-if="repairStore.currentStep === 1">
      <h2 class="mb-4 text-xl font-semibold">Choose Your Device</h2>
      
      <div v-if="deviceStore.isLoading" class="py-10 text-center">
        <div class="inline-block w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
        <p class="mt-2 text-gray-600">Loading devices...</p>
      </div>
      
      <div v-else-if="deviceStore.error" class="p-4 mb-4 text-red-600 rounded-md bg-red-50">
        {{ deviceStore.error }}
      </div>
      
      <div v-else class="grid grid-cols-2 gap-4 mb-6 sm:grid-cols-3 md:grid-cols-4">
        <div
          v-for="device in deviceStore.availableDevices"
          :key="device.id"
          @click="selectDevice(device)"
          class="transition-all duration-200 transform cursor-pointer hover:scale-105"
        >
          <div 
            class="flex flex-col items-center justify-center h-full p-4 text-center rounded-lg shadow-sm"
            :class="{ 
              'bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-primary ring-2 ring-blue-200 shadow-md': repairStore.formData.device_id === device.id,
              'bg-white border border-gray-200 hover:bg-blue-50': repairStore.formData.device_id !== device.id
            }"
          >
            <div class="w-12 h-12 mx-auto mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                <line x1="12" y1="18" x2="12" y2="18.01"></line>
              </svg>
            </div>
            <div class="text-sm font-medium" :class="{ 'text-primary': repairStore.formData.device_id === device.id }">
              {{ device.model }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end mt-6">
        <button 
          @click="repairStore.nextStep()"
          class="px-6 py-3 text-white transition-transform rounded-md shadow-md bg-primary hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          :disabled="!repairStore.isDeviceSelected"
          :class="{ 'opacity-50 cursor-not-allowed': !repairStore.isDeviceSelected }"
        >
          Next
        </button>
      </div>
    </div>
    
    <!-- Step 2: Problem Selection -->
    <div v-else-if="repairStore.currentStep === 2">
      <h2 class="mb-4 text-xl font-semibold">What Problem(s) are you facing?</h2>
      
      <div class="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 md:grid-cols-3">
        <div 
          v-for="problem in filteredProblemOptions" 
          :key="problem.value"
          @click="toggleProblem(problem.value)"
          class="p-4 transition-all duration-200 rounded-lg cursor-pointer"
          :class="{ 
            'bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-primary shadow-md': repairStore.formData.problems.includes(problem.value),
            'bg-white border border-gray-200 hover:bg-blue-50': !repairStore.formData.problems.includes(problem.value)
          }"
        >
          <div>
            <h3 class="font-medium" :class="{ 'text-primary': repairStore.formData.problems.includes(problem.value) }">
              {{ problem.label }}
            </h3>
          </div>
        </div>
      </div>
      
      <div class="flex justify-between mt-6">
        <button 
          @click="repairStore.previousStep()"
          class="px-6 py-3 transition-transform border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:scale-105 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Back
        </button>
        
        <button 
          @click="repairStore.nextStep()"
          class="px-6 py-3 text-white transition-transform rounded-md shadow-md bg-primary hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          :disabled="!repairStore.hasProblems"
          :class="{ 'opacity-50 cursor-not-allowed': !repairStore.hasProblems }"
        >
          Next
        </button>
      </div>
    </div>
    
    <!-- Step 3: Problem Details -->
    <div v-else-if="repairStore.currentStep === 3">
      <h2 class="mb-4 text-xl font-semibold">Problem Details</h2>
      
      <!-- Battery Options -->
      <div v-if="repairStore.showBatteryOptions" class="mb-8">
        <h3 class="mb-4 text-lg font-medium">Battery Replacement Options</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div 
            @click="repairStore.formData.battery_option = 'OEM'"
            class="p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-b from-blue-50 to-blue-100 border-primary ring-2 ring-blue-200': repairStore.formData.battery_option === 'OEM',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.battery_option !== 'OEM'
            }"
          >
            <div class="flex items-center mb-2">
              <span class="p-2 mr-3 bg-blue-100 rounded-full text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="7" y="2" width="10" height="20" rx="2" ry="2"/>
                  <line x1="7" y1="7" x2="17" y2="7"/>
                  <line x1="7" y1="12" x2="17" y2="12"/>
                  <line x1="7" y1="17" x2="17" y2="17"/>
                </svg>
              </span>
              <h4 class="text-lg font-medium" :class="{ 'text-primary': repairStore.formData.battery_option === 'OEM' }">Original OEM Battery</h4>
            </div>
            <div class="ml-10">
              <div class="text-sm text-gray-600">1 Year Warranty</div>
              <div v-if="devicePricing?.battery?.OEM" class="mt-1 text-sm font-semibold text-primary">
                Rs. {{ formatPrice(devicePricing.battery.OEM) }}
              </div>
            </div>
          </div>
          
          <div 
            @click="repairStore.formData.battery_option = 'Aftermarket'"
            class="p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-b from-blue-50 to-blue-100 border-primary ring-2 ring-blue-200': repairStore.formData.battery_option === 'Aftermarket',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.battery_option !== 'Aftermarket'
            }"
          >
            <div class="flex items-center mb-2">
              <span class="p-2 mr-3 bg-blue-100 rounded-full text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="7" y="2" width="10" height="20" rx="2" ry="2"/>
                  <line x1="7" y1="7" x2="17" y2="7"/>
                  <line x1="7" y1="12" x2="17" y2="12"/>
                  <line x1="7" y1="17" x2="17" y2="17"/>
                </svg>
              </span>
              <h4 class="text-lg font-medium" :class="{ 'text-primary': repairStore.formData.battery_option === 'Aftermarket' }">Aftermarket Battery</h4>
            </div>
            <div class="ml-10">
              <div class="text-sm text-gray-600">6 Months Warranty</div>
              <div v-if="devicePricing?.battery?.Aftermarket" class="mt-1 text-sm font-semibold text-primary">
                Rs. {{ formatPrice(devicePricing.battery.Aftermarket) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Display Options -->
      <div v-if="repairStore.showDisplayOptions" class="mb-8">
        <h3 class="mb-4 text-lg font-medium">Display Replacement Options</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div 
            @click="repairStore.formData.display_option = 'OEM'"
            class="p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-b from-blue-50 to-blue-100 border-primary ring-2 ring-blue-200': repairStore.formData.display_option === 'OEM',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.display_option !== 'OEM'
            }"
          >
            <div class="flex items-center mb-2">
              <span class="p-2 mr-3 bg-blue-100 rounded-full text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </span>
              <h4 class="text-lg font-medium" :class="{ 'text-primary': repairStore.formData.display_option === 'OEM' }">Original OEM Display</h4>
            </div>
            <div class="ml-10">
              <div class="text-sm text-gray-600">1 Year Warranty</div>
              <div v-if="devicePricing?.display?.OEM" class="mt-1 text-sm font-semibold text-primary">
                Rs. {{ formatPrice(devicePricing.display.OEM) }}
              </div>
            </div>
          </div>
          
          <div 
            v-if="hasRepairOption('display', 'Aftermarket')"
            @click="repairStore.formData.display_option = 'Aftermarket'"
            class="p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-b from-blue-50 to-blue-100 border-primary ring-2 ring-blue-200': repairStore.formData.display_option === 'Aftermarket',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.display_option !== 'Aftermarket'
            }"
          >
            <div class="flex items-center mb-2">
              <span class="p-2 mr-3 bg-blue-100 rounded-full text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </span>
              <h4 class="text-lg font-medium" :class="{ 'text-primary': repairStore.formData.display_option === 'Aftermarket' }">Aftermarket Display</h4>
            </div>
            <div class="ml-10">
              <div class="text-sm text-gray-600">6 Months Warranty</div>
              <div v-if="devicePricing?.display?.Aftermarket" class="mt-1 text-sm font-semibold text-primary">
                Rs. {{ formatPrice(devicePricing.display.Aftermarket) }}
              </div>
            </div>
          </div>
          
          <div class="mt-2 sm:col-span-2">
            <div 
              @click="repairStore.formData.battery_add_on = !repairStore.formData.battery_add_on"
              class="flex items-center p-4 transition-all border rounded-lg shadow-sm cursor-pointer"
              :class="{ 
                'bg-gradient-to-r from-green-50 to-blue-50 border-green-300': repairStore.formData.battery_add_on,
                'bg-white border-gray-200 hover:bg-blue-50': !repairStore.formData.battery_add_on
              }"
            >
              <div class="flex-shrink-0 mr-3">
                <div class="flex items-center justify-center w-6 h-6 border-2 rounded-md"
                  :class="{'border-primary bg-primary text-white': repairStore.formData.battery_add_on, 'border-gray-300': !repairStore.formData.battery_add_on}">
                  <svg v-if="repairStore.formData.battery_add_on" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <div>
                <span class="font-medium">Would you like to replace the battery as well?</span>
                <span class="block text-sm font-semibold text-green-600">10% discount on battery replacement</span>
              </div>
            </div>

            <!-- Battery options when bundled with display -->
            <div v-if="repairStore.formData.battery_add_on" class="pl-10 mt-3">
              <h4 class="mb-2 text-sm font-medium">Choose Battery Type:</h4>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div 
                  @click="repairStore.formData.bundle_battery_option = 'OEM'"
                  class="flex items-center p-3 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
                  :class="{ 
                    'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.bundle_battery_option === 'OEM',
                    'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.bundle_battery_option !== 'OEM'
                  }"
                >
                  <div class="flex-shrink-0 mr-2">
                    <div class="flex items-center justify-center w-5 h-5 border-2 rounded-full"
                      :class="{'border-primary bg-primary text-white': repairStore.formData.bundle_battery_option === 'OEM', 'border-gray-300': repairStore.formData.bundle_battery_option !== 'OEM'}">
                      <div v-if="repairStore.formData.bundle_battery_option === 'OEM'" class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <span class="font-medium" :class="{ 'text-primary': repairStore.formData.bundle_battery_option === 'OEM' }">OEM Battery</span>
                    <div v-if="devicePricing?.battery?.OEM" class="flex items-center text-xs">
                      <span class="mr-1 text-gray-500 line-through">Rs. {{ formatPrice(devicePricing.battery.OEM) }}</span>
                      <span class="font-semibold text-green-600">Rs. {{ formatPrice(Math.floor(devicePricing.battery.OEM * 0.9)) }}</span>
                    </div>
                  </div>
                </div>
                
                <div 
                  @click="repairStore.formData.bundle_battery_option = 'Aftermarket'"
                  class="flex items-center p-3 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
                  :class="{ 
                    'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.bundle_battery_option === 'Aftermarket',
                    'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.bundle_battery_option !== 'Aftermarket'
                  }"
                >
                  <div class="flex-shrink-0 mr-2">
                    <div class="flex items-center justify-center w-5 h-5 border-2 rounded-full"
                      :class="{'border-primary bg-primary text-white': repairStore.formData.bundle_battery_option === 'Aftermarket', 'border-gray-300': repairStore.formData.bundle_battery_option !== 'Aftermarket'}">
                      <div v-if="repairStore.formData.bundle_battery_option === 'Aftermarket'" class="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <span class="font-medium" :class="{ 'text-primary': repairStore.formData.bundle_battery_option === 'Aftermarket' }">Aftermarket Battery</span>
                    <div v-if="devicePricing?.battery?.Aftermarket" class="flex items-center text-xs">
                      <span class="mr-1 text-gray-500 line-through">Rs. {{ formatPrice(devicePricing.battery.Aftermarket) }}</span>
                      <span class="font-semibold text-green-600">Rs. {{ formatPrice(Math.floor(devicePricing.battery.Aftermarket * 0.9)) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Earpiece Options -->
      <div v-if="repairStore.showEarpieceOptions" class="mb-6">
        <!-- Similar modern UI for earpiece options -->
        <h3 class="mb-4 text-lg font-medium">Earpiece Replacement</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div 
            @click="repairStore.formData.earpiece_option = 'OEM'"
            class="p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-b from-blue-50 to-blue-100 border-primary ring-2 ring-blue-200': repairStore.formData.earpiece_option === 'OEM',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.earpiece_option !== 'OEM'
            }"
          >
            <div class="flex items-center mb-2">
              <span class="p-2 mr-3 bg-blue-100 rounded-full text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
                </svg>
              </span>
              <h4 class="text-lg font-medium" :class="{ 'text-primary': repairStore.formData.earpiece_option === 'OEM' }">Original OEM Part</h4>
            </div>
            <div class="ml-10">
              <div class="text-sm text-gray-600">1 Year Warranty</div>
              <div v-if="devicePricing?.earpiece?.OEM" class="mt-1 text-sm font-semibold text-primary">
                  Rs. {{ formatPrice(devicePricing.earpiece.OEM) }}
              </div>
            </div>
          </div>
          
          <!-- Removed Aftermarket option for earpiece as they are OEM only -->
        </div>
        
        <div 
          @click="repairStore.formData.battery_add_on = !repairStore.formData.battery_add_on"
          class="flex items-center p-4 mt-4 transition-all border rounded-lg shadow-sm cursor-pointer"
          :class="{ 
            'bg-gradient-to-r from-green-50 to-blue-50 border-green-300': repairStore.formData.battery_add_on,
            'bg-white border-gray-200 hover:bg-blue-50': !repairStore.formData.battery_add_on
          }"
        >
          <div class="flex-shrink-0 mr-3">
            <div class="flex items-center justify-center w-6 h-6 border-2 rounded-md"
              :class="{'border-primary bg-primary text-white': repairStore.formData.battery_add_on, 'border-gray-300': !repairStore.formData.battery_add_on}">
              <svg v-if="repairStore.formData.battery_add_on" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <span class="font-medium">Would you like to replace the battery as well?</span>
            <span class="block text-sm font-semibold text-green-600">10% discount on battery replacement</span>
          </div>
        </div>
        
        <!-- Battery options when bundled with earpiece -->
        <div v-if="repairStore.formData.battery_add_on" class="pl-10 mt-3">
          <h4 class="mb-2 text-sm font-medium">Choose Battery Type:</h4>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div 
              @click="repairStore.formData.bundle_battery_option = 'OEM'"
              class="flex items-center p-3 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
              :class="{ 
                'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.bundle_battery_option === 'OEM',
                'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.bundle_battery_option !== 'OEM'
              }"
            >
              <div class="flex-shrink-0 mr-2">
                <div class="flex items-center justify-center w-5 h-5 border-2 rounded-full"
                  :class="{'border-primary bg-primary text-white': repairStore.formData.bundle_battery_option === 'OEM', 'border-gray-300': repairStore.formData.bundle_battery_option !== 'OEM'}">
                  <div v-if="repairStore.formData.bundle_battery_option === 'OEM'" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <span class="font-medium" :class="{ 'text-primary': repairStore.formData.bundle_battery_option === 'OEM' }">OEM Battery</span>
                <div v-if="devicePricing?.battery?.OEM" class="flex items-center text-xs">
                  <span class="mr-1 text-gray-500 line-through">Rs. {{ formatPrice(devicePricing.battery.OEM) }}</span>
                  <span class="font-semibold text-green-600">Rs. {{ formatPrice(Math.floor(devicePricing.battery.OEM * 0.9)) }}</span>
                </div>
              </div>
            </div>
            
            <div 
              @click="repairStore.formData.bundle_battery_option = 'Aftermarket'"
              class="flex items-center p-3 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
              :class="{ 
                'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.bundle_battery_option === 'Aftermarket',
                'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.bundle_battery_option !== 'Aftermarket'
              }"
            >
              <div class="flex-shrink-0 mr-2">
                <div class="flex items-center justify-center w-5 h-5 border-2 rounded-full"
                  :class="{'border-primary bg-primary text-white': repairStore.formData.bundle_battery_option === 'Aftermarket', 'border-gray-300': repairStore.formData.bundle_battery_option !== 'Aftermarket'}">
                  <div v-if="repairStore.formData.bundle_battery_option === 'Aftermarket'" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <span class="font-medium" :class="{ 'text-primary': repairStore.formData.bundle_battery_option === 'Aftermarket' }">Aftermarket Battery</span>
                <div v-if="devicePricing?.battery?.Aftermarket" class="flex items-center text-xs">
                  <span class="mr-1 text-gray-500 line-through">Rs. {{ formatPrice(devicePricing.battery.Aftermarket) }}</span>
                  <span class="font-semibold text-green-600">Rs. {{ formatPrice(Math.floor(devicePricing.battery.Aftermarket * 0.9)) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Speaker Options -->
      <div v-if="repairStore.showSpeakerOptions" class="mb-6">
        <!-- Similar modern UI for speaker options -->
        <h3 class="mb-4 text-lg font-medium">Speaker Replacement</h3>
        
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div 
            @click="repairStore.formData.speaker_option = 'OEM'"
            class="p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-b from-blue-50 to-blue-100 border-primary ring-2 ring-blue-200': repairStore.formData.speaker_option === 'OEM',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.speaker_option !== 'OEM'
            }"
          >
            <div class="flex items-center mb-2">
              <span class="p-2 mr-3 bg-blue-100 rounded-full text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 3v18M19 6v12M5 6v12"/>
                </svg>
              </span>
              <h4 class="text-lg font-medium" :class="{ 'text-primary': repairStore.formData.speaker_option === 'OEM' }">Original OEM Part</h4>
            </div>
            <div class="ml-10">
              <div class="text-sm text-gray-600">1 Year Warranty</div>
              <div v-if="devicePricing?.speaker?.OEM" class="mt-1 text-sm font-semibold text-primary">
                  Rs. {{ formatPrice(devicePricing.speaker.OEM) }}
              </div>
            </div>
          </div>
          
          <!-- Removed Aftermarket option for speaker as they are OEM only -->
        </div>
        
        <div 
          @click="repairStore.formData.battery_add_on = !repairStore.formData.battery_add_on"
          class="flex items-center p-4 mt-4 transition-all border rounded-lg shadow-sm cursor-pointer"
          :class="{ 
            'bg-gradient-to-r from-green-50 to-blue-50 border-green-300': repairStore.formData.battery_add_on,
            'bg-white border-gray-200 hover:bg-blue-50': !repairStore.formData.battery_add_on
          }"
        >
          <div class="flex-shrink-0 mr-3">
            <div class="flex items-center justify-center w-6 h-6 border-2 rounded-md"
              :class="{'border-primary bg-primary text-white': repairStore.formData.battery_add_on, 'border-gray-300': !repairStore.formData.battery_add_on}">
              <svg v-if="repairStore.formData.battery_add_on" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <span class="font-medium">Would you like to replace the battery as well?</span>
            <span class="block text-sm font-semibold text-green-600">10% discount on battery replacement</span>
          </div>
        </div>
        
        <!-- Battery options when bundled with speaker -->
        <div v-if="repairStore.formData.battery_add_on" class="pl-10 mt-3">
          <h4 class="mb-2 text-sm font-medium">Choose Battery Type:</h4>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div 
              @click="repairStore.formData.bundle_battery_option = 'OEM'"
              class="flex items-center p-3 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
              :class="{ 
                'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.bundle_battery_option === 'OEM',
                'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.bundle_battery_option !== 'OEM'
              }"
            >
              <div class="flex-shrink-0 mr-2">
                <div class="flex items-center justify-center w-5 h-5 border-2 rounded-full"
                  :class="{'border-primary bg-primary text-white': repairStore.formData.bundle_battery_option === 'OEM', 'border-gray-300': repairStore.formData.bundle_battery_option !== 'OEM'}">
                  <div v-if="repairStore.formData.bundle_battery_option === 'OEM'" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <span class="font-medium" :class="{ 'text-primary': repairStore.formData.bundle_battery_option === 'OEM' }">OEM Battery</span>
                <div v-if="selectedDevice && devicePricing?.battery?.OEM" class="flex items-center text-xs">
                  <span class="mr-1 text-gray-500 line-through">Rs. {{ formatPrice(devicePricing.battery.OEM) }}</span>
                  <span class="font-semibold text-green-600">Rs. {{ formatPrice(Math.floor(devicePricing.battery.OEM * 0.9)) }}</span>
                </div>
              </div>
            </div>
            
            <div 
              @click="repairStore.formData.bundle_battery_option = 'Aftermarket'"
              class="flex items-center p-3 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
              :class="{ 
                'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.bundle_battery_option === 'Aftermarket',
                'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.bundle_battery_option !== 'Aftermarket'
              }"
            >
              <div class="flex-shrink-0 mr-2">
                <div class="flex items-center justify-center w-5 h-5 border-2 rounded-full"
                  :class="{'border-primary bg-primary text-white': repairStore.formData.bundle_battery_option === 'Aftermarket', 'border-gray-300': repairStore.formData.bundle_battery_option !== 'Aftermarket'}">
                  <div v-if="repairStore.formData.bundle_battery_option === 'Aftermarket'" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <span class="font-medium" :class="{ 'text-primary': repairStore.formData.bundle_battery_option === 'Aftermarket' }">Aftermarket Battery</span>
                <div v-if="devicePricing?.battery?.Aftermarket" class="flex items-center text-xs">
                  <span class="mr-1 text-gray-500 line-through">Rs. {{ formatPrice(devicePricing.battery.Aftermarket) }}</span>
                  <span class="font-semibold text-green-600">Rs. {{ formatPrice(Math.floor(devicePricing.battery.Aftermarket * 0.9)) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charging Issues -->
      <div v-if="repairStore.showChargingOptions" class="mb-6">
        <h3 class="mb-4 text-lg font-medium">Charging Issue Details</h3>
        
        <div class="grid grid-cols-1 gap-3">
          <div 
            @click="repairStore.formData.charging_issue_type = 'charges_when_off'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.charging_issue_type === 'charges_when_off',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.charging_issue_type !== 'charges_when_off'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.charging_issue_type === 'charges_when_off', 'border-gray-300': repairStore.formData.charging_issue_type !== 'charges_when_off'}">
                <div v-if="repairStore.formData.charging_issue_type === 'charges_when_off'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.charging_issue_type === 'charges_when_off' }">
              iPhone only charges when switched off
            </span>
          </div>
          
          <div 
            @click="repairStore.formData.charging_issue_type = 'water_damage'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.charging_issue_type === 'water_damage',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.charging_issue_type !== 'water_damage'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.charging_issue_type === 'water_damage', 'border-gray-300': repairStore.formData.charging_issue_type !== 'water_damage'}">
                <div v-if="repairStore.formData.charging_issue_type === 'water_damage'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.charging_issue_type === 'water_damage' }">
              iPhone stopped charging after water/accidental damage
            </span>
          </div>
          
          <div 
            @click="repairStore.formData.charging_issue_type = 'no_reason'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.charging_issue_type === 'no_reason',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.charging_issue_type !== 'no_reason'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.charging_issue_type === 'no_reason', 'border-gray-300': repairStore.formData.charging_issue_type !== 'no_reason'}">
                <div v-if="repairStore.formData.charging_issue_type === 'no_reason'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.charging_issue_type === 'no_reason' }">
              iPhone stopped charging without any reason
            </span>
          </div>
        </div>
        
        <div class="p-4 mt-4 text-sm text-yellow-800 border border-yellow-100 rounded-md shadow-sm bg-yellow-50">
          <div class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div>
              Note: Actual cost of repairs will be determined after physical inspection
            </div>
          </div>
        </div>
      </div>
      
      <!-- Dead Phone Issues -->
      <div v-if="repairStore.showDeadPhoneOptions" class="mb-6">
        <h3 class="mb-4 text-lg font-medium">Dead Phone Issue Details</h3>
        
        <div class="grid grid-cols-1 gap-3">
          <div 
            @click="repairStore.formData.dead_phone_issue_type = 'stuck_apple_logo'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.dead_phone_issue_type === 'stuck_apple_logo',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.dead_phone_issue_type !== 'stuck_apple_logo'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.dead_phone_issue_type === 'stuck_apple_logo', 'border-gray-300': repairStore.formData.dead_phone_issue_type !== 'stuck_apple_logo'}">
                <div v-if="repairStore.formData.dead_phone_issue_type === 'stuck_apple_logo'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.dead_phone_issue_type === 'stuck_apple_logo' }">
              iPhone turns on but is stuck at Apple logo
            </span>
          </div>
          
          <div 
            @click="repairStore.formData.dead_phone_issue_type = 'water_damage'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.dead_phone_issue_type === 'water_damage',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.dead_phone_issue_type !== 'water_damage'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.dead_phone_issue_type === 'water_damage', 'border-gray-300': repairStore.formData.dead_phone_issue_type !== 'water_damage'}">
                <div v-if="repairStore.formData.dead_phone_issue_type === 'water_damage'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.dead_phone_issue_type === 'water_damage' }">
              iPhone stopped charging after water/accidental damage
            </span>
          </div>
          
          <div 
            @click="repairStore.formData.dead_phone_issue_type = 'no_reason'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.dead_phone_issue_type === 'no_reason',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.dead_phone_issue_type !== 'no_reason'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.dead_phone_issue_type === 'no_reason', 'border-gray-300': repairStore.formData.dead_phone_issue_type !== 'no_reason'}">
                <div v-if="repairStore.formData.dead_phone_issue_type === 'no_reason'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.dead_phone_issue_type === 'no_reason' }">
              iPhone stopped charging without any reason
            </span>
          </div>
        </div>
        
        <div class="p-4 mt-4 text-sm text-yellow-800 border border-yellow-100 rounded-md shadow-sm bg-yellow-50">
          <div class="flex">
            <svg xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
            <div>
              Note: Actual cost of repairs will be determined after physical inspection
            </div>
          </div>
        </div>
      </div>
      
      <!-- Other Problem Description -->
      <div v-if="repairStore.showOtherProblemField" class="mb-6">
        <h3 class="mb-4 text-lg font-medium">Tell us more about your issue</h3>
        <textarea
          v-model="repairStore.formData.other_problem_description"
          rows="3"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Please describe your issue in detail..."
        ></textarea>
      </div>
      
      <div class="flex justify-between mt-6">
        <button 
          @click="repairStore.previousStep()"
          class="px-6 py-3 transition-transform border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:scale-105 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Back
        </button>
        
        <button 
          @click="repairStore.nextStep()"
          class="px-6 py-3 text-white transition-transform rounded-md shadow-md bg-primary hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Step 4: Service History -->
    <div v-else-if="repairStore.currentStep === 4">
      <h2 class="mb-4 text-xl font-semibold">Service History</h2>
      
      <div class="mb-6">
        <h3 class="mb-4 font-medium">Has your iPhone been opened or repaired before?</h3>
        
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div 
            @click="repairStore.formData.service_history = 'yes'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.service_history === 'yes',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.service_history !== 'yes'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.service_history === 'yes', 'border-gray-300': repairStore.formData.service_history !== 'yes'}">
                <div v-if="repairStore.formData.service_history === 'yes'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.service_history === 'yes' }">Yes</span>
          </div>
          
          <div 
            @click="repairStore.formData.service_history = 'no'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.service_history === 'no',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.service_history !== 'no'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.service_history === 'no', 'border-gray-300': repairStore.formData.service_history !== 'no'}">
                <div v-if="repairStore.formData.service_history === 'no'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.service_history === 'no' }">No</span>
          </div>
          
          <div 
            @click="repairStore.formData.service_history = 'unknown'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.service_history === 'unknown',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.service_history !== 'unknown'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.service_history === 'unknown', 'border-gray-300': repairStore.formData.service_history !== 'unknown'}">
                <div v-if="repairStore.formData.service_history === 'unknown'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.service_history === 'unknown' }">I don't know</span>
          </div>
        </div>
      </div>
      
      <!-- Previous Repair Details -->
      <div v-if="repairStore.formData.service_history === 'yes'" class="mb-6">
        <h3 class="mb-4 font-medium">Who was it repaired by?</h3>
        
        <div class="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2">
          <div 
            @click="repairStore.formData.previous_repair_by = 'apple'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.previous_repair_by === 'apple',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.previous_repair_by !== 'apple'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.previous_repair_by === 'apple', 'border-gray-300': repairStore.formData.previous_repair_by !== 'apple'}">
                <div v-if="repairStore.formData.previous_repair_by === 'apple'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.previous_repair_by === 'apple' }">Apple</span>
          </div>
          
          <div 
            @click="repairStore.formData.previous_repair_by = 'regen'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.previous_repair_by === 'regen',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.previous_repair_by !== 'regen'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.previous_repair_by === 'regen', 'border-gray-300': repairStore.formData.previous_repair_by !== 'regen'}">
                <div v-if="repairStore.formData.previous_repair_by === 'regen'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.previous_repair_by === 'regen' }">REGEN</span>
          </div>
          
          <div 
            @click="repairStore.formData.previous_repair_by = 'third_party'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.previous_repair_by === 'third_party',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.previous_repair_by !== 'third_party'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.previous_repair_by === 'third_party', 'border-gray-300': repairStore.formData.previous_repair_by !== 'third_party'}">
                <div v-if="repairStore.formData.previous_repair_by === 'third_party'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.previous_repair_by === 'third_party' }">3rd Party Technician</span>
          </div>
          
          <div 
            @click="repairStore.formData.previous_repair_by = 'self'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.previous_repair_by === 'self',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.previous_repair_by !== 'self'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.previous_repair_by === 'self', 'border-gray-300': repairStore.formData.previous_repair_by !== 'self'}">
                <div v-if="repairStore.formData.previous_repair_by === 'self'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.previous_repair_by === 'self' }">I opened it myself</span>
          </div>
        </div>
        
        <h3 class="mt-6 mb-4 font-medium">What was repaired or replaced?</h3>
        
        <div class="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-3">
          <div 
            @click="repairStore.formData.previous_repair_details = 'battery'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.previous_repair_details === 'battery',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.previous_repair_details !== 'battery'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.previous_repair_details === 'battery', 'border-gray-300': repairStore.formData.previous_repair_details !== 'battery'}">
                <div v-if="repairStore.formData.previous_repair_details === 'battery'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.previous_repair_details === 'battery' }">Battery was replaced</span>
          </div>
          
          <div 
            @click="repairStore.formData.previous_repair_details = 'display'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.previous_repair_details === 'display',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.previous_repair_details !== 'display'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.previous_repair_details === 'display', 'border-gray-300': repairStore.formData.previous_repair_details !== 'display'}">
                <div v-if="repairStore.formData.previous_repair_details === 'display'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.previous_repair_details === 'display' }">Display was repaired</span>
          </div>
          
          <div 
            @click="repairStore.formData.previous_repair_details = 'other'"
            class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
            :class="{ 
              'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.previous_repair_details === 'other',
              'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.previous_repair_details !== 'other'
            }"
          >
            <div class="flex-shrink-0 mr-3">
              <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                :class="{'border-primary bg-primary text-white': repairStore.formData.previous_repair_details === 'other', 'border-gray-300': repairStore.formData.previous_repair_details !== 'other'}">
                <div v-if="repairStore.formData.previous_repair_details === 'other'" class="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <span class="font-medium" :class="{ 'text-primary': repairStore.formData.previous_repair_details === 'other' }">Something else</span>
          </div>
        </div>
        
        <div v-if="repairStore.formData.previous_repair_details === 'other'" class="mt-4">
          <label for="repair-other-details" class="block mb-2 text-sm text-gray-700">Please specify:</label>
          <textarea
            id="repair-other-details"
            v-model="repairStore.formData.previous_repair_other_details"
            rows="2"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Please describe the previous repairs..."
          ></textarea>
        </div>
      </div>
      
      <div class="flex justify-between mt-6">
        <button 
          @click="repairStore.previousStep()"
          class="px-6 py-3 transition-transform border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:scale-105 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Back
        </button>
        
        <button 
          @click="repairStore.nextStep()"
          class="px-6 py-3 text-white transition-transform rounded-md shadow-md bg-primary hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        >
          Next
        </button>
      </div>
    </div>
    
    <!-- Step 5: Contact & Terms -->
    <div v-else-if="repairStore.currentStep === 5">
      <h2 class="mb-4 text-xl font-semibold">Contact & Location Details</h2>
      
      <div class="mb-6 space-y-4">
        <div>
          <label for="full-name" class="block mb-2 font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            id="full-name"
            v-model="repairStore.formData.full_name"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter your full name"
          />
        </div>
        
        <div>
          <label for="whatsapp" class="block mb-2 font-medium text-gray-700">WhatsApp Number</label>
          <input
            type="tel"
            id="whatsapp"
            v-model="repairStore.formData.whatsapp_number"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="e.g., 03001234567"
          />
        </div>
        
        <div>
          <label class="block mb-2 font-medium text-gray-700">Are you from Lahore?</label>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div 
              @click="repairStore.formData.is_from_lahore = true"
              class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
              :class="{ 
                'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.is_from_lahore === true,
                'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.is_from_lahore !== true
              }"
            >
              <div class="flex-shrink-0 mr-3">
                <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                  :class="{'border-primary bg-primary text-white': repairStore.formData.is_from_lahore === true, 'border-gray-300': repairStore.formData.is_from_lahore !== true}">
                  <div v-if="repairStore.formData.is_from_lahore === true" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <span class="font-medium" :class="{ 'text-primary': repairStore.formData.is_from_lahore === true }">Yes</span>
            </div>
            
            <div 
              @click="repairStore.formData.is_from_lahore = false"
              class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
              :class="{ 
                'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.is_from_lahore === false,
                'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.is_from_lahore !== false
              }"
            >
              <div class="flex-shrink-0 mr-3">
                <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                  :class="{'border-primary bg-primary text-white': repairStore.formData.is_from_lahore === false, 'border-gray-300': repairStore.formData.is_from_lahore !== false}">
                  <div v-if="repairStore.formData.is_from_lahore === false" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <span class="font-medium" :class="{ 'text-primary': repairStore.formData.is_from_lahore === false }">No</span>
            </div>
          </div>
        </div>
        
        <div v-if="repairStore.formData.is_from_lahore">
          <label class="block mb-2 font-medium text-gray-700">Would you like pickup & delivery?</label>
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div 
              @click="repairStore.formData.needs_pickup_delivery = true"
              class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
              :class="{ 
                'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.needs_pickup_delivery === true,
                'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.needs_pickup_delivery !== true
              }"
            >
              <div class="flex-shrink-0 mr-3">
                <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                  :class="{'border-primary bg-primary text-white': repairStore.formData.needs_pickup_delivery === true, 'border-gray-300': repairStore.formData.needs_pickup_delivery !== true}">
                  <div v-if="repairStore.formData.needs_pickup_delivery === true" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div>
                <span class="font-medium" :class="{ 'text-primary': repairStore.formData.needs_pickup_delivery === true }">Yes</span>
                <span class="block text-sm text-green-600">Rs 500 charge</span>
              </div>
            </div>
            
            <div 
              @click="repairStore.formData.needs_pickup_delivery = false"
              class="flex items-center p-4 transition-all duration-200 border rounded-lg shadow-sm cursor-pointer"
              :class="{ 
                'bg-gradient-to-r from-blue-50 to-blue-100 border-primary': repairStore.formData.needs_pickup_delivery === false,
                'bg-white border-gray-200 hover:bg-blue-50': repairStore.formData.needs_pickup_delivery !== false
              }"
            >
              <div class="flex-shrink-0 mr-3">
                <div class="flex items-center justify-center w-6 h-6 border-2 rounded-full"
                  :class="{'border-primary bg-primary text-white': repairStore.formData.needs_pickup_delivery === false, 'border-gray-300': repairStore.formData.needs_pickup_delivery !== false}">
                  <div v-if="repairStore.formData.needs_pickup_delivery === false" class="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <span class="font-medium" :class="{ 'text-primary': repairStore.formData.needs_pickup_delivery === false }">No</span>
            </div>
          </div>
        </div>
        
        <div v-if="repairStore.formData.needs_pickup_delivery">
          <label for="address" class="block mb-2 font-medium text-gray-700">Address</label>
          <textarea
            id="address"
            v-model="repairStore.formData.address"
            rows="2"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Enter your full address"
          ></textarea>
        </div>
      </div>
      
      <div class="p-5 mb-6 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
        <div 
          @click="repairStore.formData.agreed_to_terms = !repairStore.formData.agreed_to_terms"
          class="flex items-start cursor-pointer"
        >
          <div class="flex-shrink-0 mr-3">
            <div class="flex items-center justify-center w-6 h-6 border-2 rounded-md"
              :class="{'border-primary bg-primary text-white': repairStore.formData.agreed_to_terms, 'border-gray-300': !repairStore.formData.agreed_to_terms}">
              <svg v-if="repairStore.formData.agreed_to_terms" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <span class="font-medium">I agree with the</span>
            <router-link to="/terms" target="_blank" class="ml-1 text-primary hover:underline">
              Terms & Conditions
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="flex justify-between mt-6">
        <button 
          @click="repairStore.previousStep()"
          class="px-6 py-3 transition-transform border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:scale-105 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Back
        </button>
        
        <button 
          @click="submitForm"
          class="px-6 py-3 text-white transition-transform rounded-md shadow-md bg-primary hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
          :disabled="!repairStore.isFormComplete"
          :class="{ 'opacity-50 cursor-not-allowed': !repairStore.isFormComplete }"
        >
          Submit Request
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDeviceStore } from '../store/deviceStore';
import { useRepairStore } from '../store/repairStore';
import StepIndicator from '../components/ui/StepIndicator.vue';

const router = useRouter();
const deviceStore = useDeviceStore();
const repairStore = useRepairStore();

// Form steps
const steps = [
  'Device Selection',
  'Problem Selection',
  'Problem Details',
  'Service History',
  'Contact & Terms'
];

// Problem options 
const problemOptions = [
  { value: 'battery', label: 'Battery needs replacement' },
  { value: 'display', label: 'Display needs replacement' },
  { value: 'earpiece', label: 'Earpiece is not working' },
  { value: 'speaker', label: 'Speaker is not working' },
  { value: 'charging', label: 'Phone is not charging' },
  { value: 'dead', label: 'Phone is dead' },
  { value: 'other', label: 'Something else' }
];

// Filtered problem options - only filter out earpiece and speaker for iPhone 14 series
const filteredProblemOptions = computed(() => {
  if (!selectedDevice.value) return problemOptions;
  
  // For iPhone 14 series, filter out earpiece and speaker repairs only
  if (selectedDevice.value.model.includes('iPhone 14')) {
    return problemOptions.filter(problem => 
      problem.value !== 'earpiece' && problem.value !== 'speaker'
    );
  }
  
  // For all other devices, show all problem options
  return problemOptions;
});

// Toggle problem selection
const toggleProblem = (problem) => {
  if (repairStore.formData.problems.includes(problem)) {
    repairStore.removeProblem(problem);
  } else {
    repairStore.selectProblem(problem);
  }
};

// Selected problems with two-way binding to the store
const selectedProblems = computed({
  get: () => repairStore.formData.problems,
  set: (value) => repairStore.formData.problems = value
});

// Selected device from store
const selectedDevice = computed(() => {
  if (!repairStore.formData.device_id) return null;
  return deviceStore.getDeviceById(repairStore.formData.device_id);
});

// Device pricing data for the selected device
const devicePricing = computed(() => {
  if (!selectedDevice.value?.model) return null;
  return repairStore.pricingData[selectedDevice.value.model];
});

// Helper to select a device
const selectDevice = (device) => {
  repairStore.updateFormField('device_id', device.id);
  deviceStore.selectDevice(device);
  
  // Auto-navigate to next step on mobile devices
  if (window.innerWidth < 768) { // Standard mobile breakpoint
    repairStore.nextStep();
  }
};

// Format price helper
const formatPrice = (price) => {
  if (!price) return '-';
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Get price range for a problem
const getPriceRangeForProblem = (problem) => {
  if (!devicePricing.value || !devicePricing.value[problem]) return null;
  
  if (problem === 'battery' && devicePricing.value.battery) {
    const oem = devicePricing.value.battery.OEM;
    const aftermarket = devicePricing.value.battery.Aftermarket;
    if (oem && aftermarket) {
      return `Rs. ${formatPrice(aftermarket)} - ${formatPrice(oem)}`;
    } else if (oem) {
      return `Rs. ${formatPrice(oem)}`;
    } else if (aftermarket) {
      return `Rs. ${formatPrice(aftermarket)}`;
    }
  } else if (problem === 'display' && devicePricing.value.display) {
    const oem = devicePricing.value.display.OEM;
    const aftermarket = devicePricing.value.display.Aftermarket;
    if (oem && aftermarket) {
      return `Rs. ${formatPrice(aftermarket)} - ${formatPrice(oem)}`;
    } else if (oem) {
      return `Rs. ${formatPrice(oem)}`;
    } else if (aftermarket) {
      return `Rs. ${formatPrice(aftermarket)}`;
    }
  } else if ((problem === 'earpiece' || problem === 'speaker') && devicePricing.value[problem]) {
    return `Rs. ${formatPrice(devicePricing.value[problem])}`;
  }
  
  return null;
};

// Check if a device supports a specific repair type and option
const hasRepairOption = (repairType, option = null) => {
  if (!selectedDevice.value) return false;
  return repairStore.hasRepairOption(selectedDevice.value, repairType, option);
};

// Submit form
const submitForm = async () => {
  try {
    await repairStore.submitForm();
    router.push('/success');
  } catch (error) {
    console.error('Form submission error:', error);
    // Error handling can be improved here
  }
};

// Load devices and pricing data on component mount
onMounted(async () => {
  if (deviceStore.devices.length === 0) {
    await deviceStore.fetchDevices();
  }
  
  try {
    await repairStore.fetchPricingData();
    console.log('===== PRICING DATA DEBUG =====');
    console.log('Full pricing data structure:', repairStore.pricingData);
    
    // Wait for device and pricing data to be available
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (selectedDevice.value?.model) {
      const model = selectedDevice.value.model;
      console.log('Selected device model:', model);
      
      if (repairStore.pricingData[model]) {
        console.log('Device pricing data:', repairStore.pricingData[model]);
        
        // Debug battery prices
        if (repairStore.pricingData[model].battery) {
          console.log('Battery pricing:', repairStore.pricingData[model].battery);
        }
        
        // Debug display prices
        if (repairStore.pricingData[model].display) {
          console.log('Display pricing:', repairStore.pricingData[model].display);
        }
        
        // Debug earpiece prices
        if (repairStore.pricingData[model].earpiece) {
          console.log('Earpiece pricing:', repairStore.pricingData[model].earpiece);
        }
        
        // Debug speaker prices
        if (repairStore.pricingData[model].speaker) {
          console.log('Speaker pricing:', repairStore.pricingData[model].speaker);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching pricing data:', error);
  }
});

// Reset form when navigating away
onMounted(() => {
  repairStore.resetForm();
});
</script>