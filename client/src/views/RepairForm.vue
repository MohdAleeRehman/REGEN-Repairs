<template>
  <div class="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow-md">
    <h1 class="mb-6 text-3xl font-bold text-center">Submit Your Repair</h1>
    
    <!-- Tooltip for repair info -->
    <div 
      v-if="activeTooltip"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      @click="activeTooltip = null"
    >
      <div 
        class="relative max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl"
        @click.stop
      >
        <button 
          @click="activeTooltip = null"
          class="absolute p-1 text-gray-400 transition-colors top-2 right-2 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div v-if="activeTooltip === 'oem_battery'" class="space-y-3">
          <h3 class="mb-2 text-xl font-semibold text-primary">Original OEM Battery</h3>
          <p>Original Equipment Manufacturer (OEM) batteries are authentic replacements sourced from Apple's supply chain or authorized providers.</p>
          <ul class="pl-6 mt-2 space-y-1 list-disc">
            <li>Maximum capacity retention over time</li>
            <li>Full compatibility with iOS battery health features</li>
            <li>1 Year warranty protection</li>
            <li>Same quality as official Apple battery replacements</li>
          </ul>
        </div>
        
        <div v-if="activeTooltip === 'aftermarket_battery'" class="space-y-3">
          <h3 class="mb-2 text-xl font-semibold text-primary">Aftermarket Battery</h3>
          <p>Aftermarket batteries are high-quality third-party alternatives to OEM batteries.</p>
          <ul class="pl-6 mt-2 space-y-1 list-disc">
            <li>Good capacity comparable to OEM batteries</li>
            <li>Cost-effective alternative</li>
            <li>6 months warranty protection</li>
            <li>May have slightly less capacity retention over extended use</li>
          </ul>
        </div>
        
        <div v-if="activeTooltip === 'oem_display'" class="space-y-3">
          <h3 class="mb-2 text-xl font-semibold text-primary">Original OEM Display</h3>
          <p>Original Equipment Manufacturer (OEM) displays are sourced from Apple's official supply chain.</p>
          <ul class="pl-6 mt-2 space-y-1 list-disc">
            <li>Perfect color accuracy and touch responsiveness</li>
            <li>Full True Tone functionality</li>
            <li>Maximum brightness identical to original screen</li>
            <li>1 Year warranty protection</li>
          </ul>
        </div>
        
        <div v-if="activeTooltip === 'aftermarket_display'" class="space-y-3">
          <h3 class="mb-2 text-xl font-semibold text-primary">Aftermarket Display</h3>
          <p>Aftermarket displays are high-quality third-party alternatives to OEM screens.</p>
          <ul class="pl-6 mt-2 space-y-1 list-disc">
            <li>Good visual quality for everyday use</li>
            <li>Cost-effective alternative</li>
            <li>Compatible with most iPhone features</li>
            <li>6 months warranty protection</li>
            <li>May have minor differences in color calibration</li>
          </ul>
        </div>
      </div>
    </div>
    
    <StepIndicator 
      :steps="steps" 
      :currentStep="repairStore.currentStep" 
    />
    
    <!-- Step 1: Device Selection -->
    <div v-if="repairStore.currentStep === 1" class="transition-all duration-300">
      <h2 class="mb-4 text-xl font-semibold" ref="step1Heading">Choose Your Device</h2>
      
      <div v-if="deviceStore.isLoading" class="py-10 text-center">
        <div class="inline-block w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-primary"></div>
        <p class="mt-2 text-gray-600">Loading devices...</p>
      </div>
      
      <div v-else-if="deviceStore.error" class="p-4 mb-4 text-red-600 rounded-md bg-red-50">
        {{ deviceStore.error }}
      </div>
      
      <div v-else class="grid grid-cols-2 gap-6 mb-6 sm:grid-cols-3 md:grid-cols-4">
        <div
          v-for="device in deviceStore.availableDevices"
          :key="device.id"
          @click="selectDevice(device)"
          @keyup.enter="selectDevice(device)"
          @keyup.space="selectDevice(device)"
          class="transition-all duration-200 transform cursor-pointer hover:scale-105"
          tabindex="0"
          role="button"
          :aria-selected="repairStore.formData.device_id === device.id"
        >
          <div 
            class="flex flex-col items-center justify-center h-full p-4 text-center rounded-lg shadow-sm"
            :class="{ 
              'bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-primary ring-2 ring-blue-200 shadow-md': repairStore.formData.device_id === device.id,
              'bg-white border border-gray-200 hover:bg-blue-50': repairStore.formData.device_id !== device.id
            }"
          >
            <div class="relative w-24 h-24 mx-auto mb-2">
              <template v-if="device.image_url">
                <div v-if="!imageLoaded[device.id]" class="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-md animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <img 
                  :src="device.image_url" 
                  :alt="device.model"
                  class="object-contain w-full h-full transition-opacity duration-300"
                  :class="{ 'opacity-0': !imageLoaded[device.id], 'opacity-100': imageLoaded[device.id] }"
                  @load="imageLoaded[device.id] = true"
                  loading="lazy"
                  decoding="async"
                  :fetchpriority="isHighPriorityDevice(device) ? 'high' : 'low'"
                  width="96"
                  height="96"
                />
              </template>
              <svg 
                v-else
                xmlns="http://www.w3.org/2000/svg" 
                class="w-full h-full" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="1.5" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
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
    </div>
    
    <!-- Step 2: Problem Selection -->
    <div v-if="repairStore.currentStep === 2" class="transition-all duration-300">
      <h2 class="mb-4 text-xl font-semibold" ref="step2Heading" tabindex="-1">What Problem(s) are you facing?</h2>
      
      <div class="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 md:grid-cols-3">
        <div 
          v-for="problem in filteredProblemOptions" 
          :key="problem.value"
          @click="toggleProblem(problem.value)"
          @keyup.enter="toggleProblem(problem.value)"
          @keyup.space="toggleProblem(problem.value)"
          class="p-4 transition-all duration-200 rounded-lg cursor-pointer"
          tabindex="0"
          role="checkbox"
          :aria-checked="repairStore.formData.problems.includes(problem.value)"
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
          @click="previousWithAnimation()"
          class="px-6 py-3 transition-transform border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:scale-105 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Back
        </button>
        
        <button 
          v-if="isProblemSelected"
          @click="nextWithAnimation()"
          class="px-6 py-3 text-white transition-transform rounded-md shadow-md bg-primary hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        >
          Continue
        </button>
      </div>
    </div>
    
    <!-- Step 3: Problem Details -->
    <div v-else-if="repairStore.currentStep === 3">
      <h2 class="mb-4 text-xl font-semibold" ref="step3Heading" tabindex="-1">Problem Details</h2>
      
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
              <h4 class="text-lg font-medium" :class="{ 'text-primary': repairStore.formData.battery_option === 'OEM' }">
                Original OEM Battery
                <span 
                  class="inline-flex ml-1 text-blue-500 cursor-pointer hover:text-blue-600"
                  @click.stop="showTooltip('oem_battery')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </span>
              </h4>
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
              <h4 class="text-lg font-medium" :class="{ 'text-primary': repairStore.formData.battery_option === 'Aftermarket' }">
                Aftermarket Battery
                <span 
                  class="inline-flex ml-1 text-blue-500 cursor-pointer hover:text-blue-600"
                  @click.stop="showTooltip('aftermarket_battery')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </span>
              </h4>
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
              <h4 class="text-lg font-medium" :class="{ 'text-primary': repairStore.formData.display_option === 'OEM' }">
                Original OEM Display
                <span 
                  class="inline-flex ml-1 text-blue-500 cursor-pointer hover:text-blue-600"
                  @click.stop="showTooltip('oem_display')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </span>
              </h4>
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
              <h4 class="text-lg font-medium" :class="{ 'text-primary': repairStore.formData.display_option === 'Aftermarket' }">
                Aftermarket Display
                <span 
                  class="inline-flex ml-1 text-blue-500 cursor-pointer hover:text-blue-600"
                  @click.stop="showTooltip('aftermarket_display')"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </span>
              </h4>
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
          @click="previousWithAnimation()"
          class="px-6 py-3 transition-transform border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:scale-105 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Back
        </button>
        
        <button 
          v-if="repairStore.isProblemDetailsValid"
          @click="nextWithAnimation()"
          class="px-6 py-3 text-white transition-transform rounded-md shadow-md bg-primary hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        >
          Continue
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
            @click="() => { 
              repairStore.formData.previous_repair_by = 'apple';
              console.log('Selected repair provider: apple, repair details:', repairStore.formData.previous_repair_details);
            }"
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
            @click="() => {
              repairStore.formData.previous_repair_details = 'battery';
              console.log('Selected repair details: battery, is now valid:', isServiceHistoryValid);
            }"
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
            @click="() => {
              repairStore.formData.previous_repair_details = 'display';
              console.log('Selected repair details: display, is now valid:', isServiceHistoryValid);
            }"
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
            @click="() => {
              repairStore.formData.previous_repair_details = 'other';
              console.log('Selected repair details: other, is now valid:', isServiceHistoryValid);
            }"
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
          @click="previousWithAnimation()"
          class="px-6 py-3 transition-transform border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:scale-105 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Back
        </button>
        
        <button 
          v-if="isServiceHistoryValid"
          @click="nextWithAnimation()"
          class="px-6 py-3 text-white transition-transform rounded-md shadow-md bg-primary hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        >
          Continue
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
          @click="previousWithAnimation()"
          class="px-6 py-3 transition-transform border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:scale-105 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
        >
          Back
        </button>
        
        <button 
          v-if="repairStore.isFormValid"
          @click="submitForm()"
          class="px-6 py-3 text-white transition-transform rounded-md shadow-md bg-primary hover:bg-blue-700 hover:scale-105 focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
        >
          Submit Request
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useDeviceStore } from '../store/deviceStore';
import { useRepairStore } from '../store/repairStore';
import StepIndicator from '../components/ui/StepIndicator.vue';

const router = useRouter();
const deviceStore = useDeviceStore();
const repairStore = useRepairStore();

// Track image loading state for each device with reactive ref
const imageLoaded = ref({});

// Add new state to track if viewport is visible
const isVisible = ref(true);

// State for the active tooltip
const activeTooltip = ref(null);

// Function to show tooltip info
const showTooltip = (tooltipType) => {
  activeTooltip.value = tooltipType;
};
const formStateKey = 'repair_form_state';

// Function to save the form state to session storage
const saveFormState = () => {
  const state = {
    formData: repairStore.formData,
    currentStep: repairStore.currentStep
  };
  sessionStorage.setItem(formStateKey, JSON.stringify(state));
};

// Setup swipe gesture detection
const setupSwipeGestures = () => {
  // Variables to track swipe
  let touchStartX = 0;
  let touchEndX = 0;
  const minSwipeDistance = 100; // Minimum distance required for a swipe
  
  // Container element to attach events to
  const container = document.querySelector('.max-w-4xl');
  if (!container) return;
  
  // Touch start event
  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };
  
  // Touch end event
  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  };
  
  // Handle the swipe
  const handleSwipe = () => {
    // Minimum distance for swipe
    if (Math.abs(touchEndX - touchStartX) < minSwipeDistance) return;
    
    const swipedRight = touchEndX > touchStartX;
    
    if (swipedRight && repairStore.currentStep > 1) {
      // Swiped right - go back
      previousWithAnimation();
    } else if (!swipedRight && repairStore.currentStep < repairStore.totalSteps) {
      // Swiped left - go forward
      if (repairStore.canProceedToNextStep) {
        nextWithAnimation();
      }
    }
  };
  
  // Add event listeners
  container.addEventListener('touchstart', handleTouchStart, { passive: true });
  container.addEventListener('touchend', handleTouchEnd, { passive: true });
  
  // Remove event listeners on cleanup
  onBeforeUnmount(() => {
    container.removeEventListener('touchstart', handleTouchStart);
    container.removeEventListener('touchend', handleTouchEnd);
  });
};

// Main onMounted hook to initialize everything
onMounted(() => {
  // Fetch device data first
  deviceStore.fetchDevices();
  
  // Restore form state if navigating with browser back button
  const savedState = sessionStorage.getItem(formStateKey);
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState);
      if (parsedState.formData && parsedState.currentStep) {
        repairStore.formData = parsedState.formData;
        repairStore.currentStep = parsedState.currentStep;
        console.log('Form state restored from session storage');
      }
    } catch (e) {
      console.error('Error restoring form state:', e);
    }
  }
  
  // Initialize image loaded state from session storage
  try {
    const cachedImageStates = sessionStorage.getItem('regen-device-images-loaded');
    if (cachedImageStates) {
      const parsedState = JSON.parse(cachedImageStates);
      Object.keys(parsedState).forEach(key => {
        imageLoaded.value[key] = parsedState[key];
      });
    }
  } catch (e) {
    console.error('Error loading image cache:', e);
  }

  // Set up intersection observer
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isVisible.value = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    
    const container = document.querySelector('.max-w-4xl');
    if (container) {
      observer.observe(container);
    }
  }
  
  // Setup mobile swipe gesture handling for improved navigation
  setupSwipeGestures();
  
  // Setup event listeners for saving form state
  window.addEventListener('beforeunload', saveFormState);
});

// Cleanup on component unmount
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', saveFormState);
  saveFormState();
  
  // Clean up observer if needed
  const container = document.querySelector('.max-w-4xl');
  if (container && window.IntersectionObserver) {
    // This is a simplified cleanup as we don't have the observer reference here
    // The browser will clean it up eventually when the component is destroyed
  }
});

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

// Validation for Step 1 - Device Selection
const isDeviceSelected = computed(() => {
  return !!repairStore.formData.device_id;
});

// Validation for Step 2 - Problem Selection
const isProblemSelected = computed(() => {
  return repairStore.formData.problems && repairStore.formData.problems.length > 0;
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
  
  // Auto-navigate to next step for all devices
  nextWithAnimation();
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

// Check if a device is high priority
const isHighPriorityDevice = (device) => {
  const highPriorityModels = [
    'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11'
  ];
  
  if (!device?.model) return false;
  
  return highPriorityModels.some(prefix => device.model.includes(prefix));
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
  
  // Set focus to heading when step changes
  if (repairStore.currentStep === 1) {
    setFocusToCurrentStep();
  }
  
  // Preload device images
  preloadDeviceImages();
});

// Preload device images to improve loading experience
const preloadDeviceImages = () => {
  // Wait for devices to be loaded
  if (deviceStore.devices.length === 0) return;
  
  // Import the image optimization service
  import('../services/imageOptimizer').then(({ default: imageOptimizer }) => {
    // Prioritize iPhone models that are likely to be visible first
    const priorityOrder = [
      'iPhone 14', 'iPhone 13', 'iPhone 12', 'iPhone 11',
      'iPhone SE', 'iPhone X', 'iPhone 8', 'iPhone 7'
    ];
    
    // Sort devices by priority for loading
    const sortedDevices = [...deviceStore.devices].sort((a, b) => {
      const aIndex = priorityOrder.findIndex(prefix => a.model.includes(prefix));
      const bIndex = priorityOrder.findIndex(prefix => b.model.includes(prefix));
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
    
    // Check if we're on a mobile connection
    const lowBandwidth = imageOptimizer.isLowBandwidthConnection();
    
    // Load first 4 devices immediately, delay others based on connection speed
    const firstBatchSize = lowBandwidth ? 2 : 4;
    const firstBatch = sortedDevices.slice(0, firstBatchSize);
    const secondBatch = sortedDevices.slice(firstBatchSize, firstBatchSize + 4);
    const remainingDevices = sortedDevices.slice(firstBatchSize + 4);
    
    // Create optimized URLs for all devices once to ensure consistency
    const optimizedUrls = new Map();
    
    sortedDevices.forEach(device => {
      if (device.image_url && !optimizedUrls.has(device.id)) {
        // Store the optimized URL in our map
        optimizedUrls.set(device.id, imageOptimizer.optimizeCloudinaryUrl(device.image_url));
      }
    });
    
    // Apply optimized URLs to devices
    sortedDevices.forEach(device => {
      if (device.image_url && optimizedUrls.has(device.id)) {
        device.image_url = optimizedUrls.get(device.id);
      }
    });
    
    // Load first batch immediately with high priority
    Promise.all(firstBatch.map(device => {
      return imageOptimizer.preloadImage(device, 'high').then(success => {
        if (success) {
          imageLoaded.value[device.id] = true;
        }
      });
    }));
    
    // Load second batch after a short delay with medium priority
    if (secondBatch.length > 0) {
      setTimeout(() => {
        secondBatch.forEach(device => {
          imageOptimizer.preloadImage(device, 'medium').then(success => {
            if (success) {
              imageLoaded.value[device.id] = true;
            }
          });
        });
      }, lowBandwidth ? 2000 : 500);
    }
    
    // Load remaining devices after longer delay with low priority
    if (remainingDevices.length > 0) {
      setTimeout(() => {
        remainingDevices.forEach(device => {
          imageOptimizer.preloadImage(device, 'low').then(success => {
            if (success) {
              imageLoaded.value[device.id] = true;
            }
          });
        });
      }, lowBandwidth ? 4000 : 1500);
    }
  }).catch(err => {
    console.error('Failed to load image optimizer:', err);
  });
};

// Watch for devices loading and preload images when they become available
watch(() => deviceStore.devices, (newDevices) => {
  if (newDevices.length > 0) {
    preloadDeviceImages();
  }
}, { immediate: true });

// Set focus to the appropriate heading based on current step
const setFocusToCurrentStep = () => {
  // Use the same logic as focusCurrentStepHeading
  setTimeout(focusCurrentStepHeading, 50);
};

// References for focus management
const step1Heading = ref(null);
const step2Heading = ref(null);
const step3Heading = ref(null);
const step4Heading = ref(null);
const step5Heading = ref(null);

// Navigation with animation and focus management
const nextWithAnimation = () => {
  // Add a sliding out animation class first
  const container = document.querySelector('.max-w-4xl');
  if (container) {
    container.classList.add('slide-right-out');
    
    // After animation completes, move to next step and slide in
    setTimeout(() => {
      repairStore.nextStep();
      container.classList.remove('slide-right-out');
      container.classList.add('slide-right-in');
      
      // Set focus on the heading of the new step
      setTimeout(() => {
        container.classList.remove('slide-right-in');
        
        // Focus the appropriate heading based on the current step
        focusCurrentStepHeading();
      }, 280); // Slightly shorter to prevent visual lag
    }, 280); // Slightly shorter to prevent visual lag
  } else {
    repairStore.nextStep();
  }
};

const previousWithAnimation = () => {
  // Add a sliding out animation class first
  const container = document.querySelector('.max-w-4xl');
  if (container) {
    container.classList.add('slide-left-out');
    
    // After animation completes, move to previous step and slide in
    setTimeout(() => {
      repairStore.previousStep();
      container.classList.remove('slide-left-out');
      container.classList.add('slide-left-in');
      
      // Set focus on the heading of the new step
      setTimeout(() => {
        container.classList.remove('slide-left-in');
        
        // Focus the appropriate heading based on the current step
        focusCurrentStepHeading();
      }, 280); // Slightly shorter to prevent visual lag
    }, 280); // Slightly shorter to prevent visual lag
  } else {
    repairStore.previousStep();
  }
};

// Scroll to the heading of the current step (without focusing)
const focusCurrentStepHeading = () => {
  switch (repairStore.currentStep) {
    case 1:
      if (step1Heading.value) step1Heading.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    case 2:
      if (step2Heading.value) step2Heading.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    case 3:
      if (step3Heading.value) step3Heading.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    case 4:
      if (step4Heading.value) step4Heading.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
    case 5:
      if (step5Heading.value) step5Heading.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      break;
  }
};

// Watch for step changes to handle focus
watch(() => repairStore.currentStep, (newStep) => {
  // Add a small delay to ensure DOM is updated
  setTimeout(focusCurrentStepHeading, 50);
});

// Watch for service history changes to reset dependent fields
watch(
  () => repairStore.formData.service_history,
  (newVal) => {
    // If service history is changed, reset the related fields
    if (newVal !== 'yes') {
      repairStore.formData.previous_repair_by = null;
      repairStore.formData.previous_repair_details = null;
      repairStore.formData.previous_repair_other_details = '';
    }
  }
);

// Watch for repair provider changes to reset repair details
watch(
  () => repairStore.formData.previous_repair_by,
  (newVal, oldVal) => {
    // Only reset if the value actually changed
    if (newVal !== oldVal) {
      console.log(`Repair provider changed from ${oldVal} to ${newVal}, resetting repair details`);
      
      // Reset to ensure user explicitly selects repair details
      repairStore.formData.previous_repair_details = null;
      repairStore.formData.previous_repair_other_details = '';
    }
  }
);

// Watch for repair details changes
watch(
  () => repairStore.formData.previous_repair_details,
  (newVal, oldVal) => {
    console.log(`Repair details changed from ${oldVal} to ${newVal}`);
    console.log(`Validation state is now: ${isServiceHistoryValid.value ? 'valid' : 'invalid'}`);
  }
);

// Previous repair details options
const previousRepairDetails = [
  { value: 'screen', label: 'Screen/Display' },
  { value: 'battery', label: 'Battery' },
  { value: 'camera', label: 'Camera' },
  { value: 'charging_port', label: 'Charging Port' },
  { value: 'speakers', label: 'Speakers' },
  { value: 'buttons', label: 'Buttons' },
  { value: 'other', label: 'Other' }
];

// Local computed property for validation
const isServiceHistoryValid = computed(() => {
  const { service_history, previous_repair_by, previous_repair_details, previous_repair_other_details } = repairStore.formData;
  
  // First check if service history is selected
  if (service_history === null) return false;
  
  // If 'yes' is selected, check if previous repair provider is selected
  if (service_history === 'yes') {
    if (!previous_repair_by) return false;
    
    // Also check if repair details are selected
    if (!previous_repair_details) return false;
    
    // If 'other' is selected for repair details, check if description is provided
    if (previous_repair_details === 'other' && 
        (!previous_repair_other_details || previous_repair_other_details.trim() === '')) {
      return false;
    }
  }
  
  return true;
});

// Toggle previous repair detail - Updated to match current implementation
const togglePreviousRepairDetail = (detail) => {
  // Set the detail as a string value
  repairStore.formData.previous_repair_details = detail;
  
  // This function is currently unused, but updated for consistency
  if (false) {
    repairStore.formData.previous_repair_details.push(detail);
  }
};

// Handler for location selection
const handleLocationSelection = (isFromLahore) => {
  repairStore.formData.is_from_lahore = isFromLahore;
  
  // Reset related fields when changing location
  if (!isFromLahore) {
    repairStore.formData.needs_pickup_delivery = false;
    repairStore.formData.address = '';
  }
};
</script>

<style scoped>
/* Transition animations */
.slide-right-out {
  animation: slideRightOut 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.slide-right-in {
  animation: slideRightIn 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.slide-left-out {
  animation: slideLeftOut 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

.slide-left-in {
  animation: slideLeftIn 0.3s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

@keyframes slideRightOut {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-20px);
    opacity: 0;
  }
}

@keyframes slideRightIn {
  0% {
    transform: translateX(20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideLeftOut {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(20px);
    opacity: 0;
  }
}

@keyframes slideLeftIn {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Mobile-friendly styles */
@media (max-width: 768px) {
  /* Make touch targets larger on mobile */
  [role="button"], 
  [role="checkbox"],
  button {
    min-height: 44px;
  }
  
  /* Add bottom spacing to avoid items being hidden by virtual keyboard */
  .max-w-4xl {
    padding-bottom: 120px;
    /* Use hardware acceleration for smoother animations on mobile */
    transform: translateZ(0);
  }
  
  /* Optimize animations for mobile */
  .slide-right-out, 
  .slide-right-in,
  .slide-left-out,
  .slide-left-in {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
}

/* Device image styling */
.w-24.h-24 {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  margin: 0 auto;
}

.w-24.h-24 img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease, opacity 0.3s ease;
  position: relative;
  z-index: 1;
}

[role="button"]:hover .w-24.h-24 img {
  transform: scale(1.05);
}

/* Skeleton loader styling */
.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: 0.375rem;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
}

/* Improve visibility for SVG fallback icons */
.w-24.h-24 svg {
  color: #4B5563;  /* text-gray-600 */
  width: 80%;
  height: 80%;
  margin: auto;
}
</style>