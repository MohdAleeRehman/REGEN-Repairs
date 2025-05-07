<template>
  <div class="bg-white">
    <!-- Hero Section -->
    <div class="relative py-16 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 sm:py-24">
      <div class="px-6 mx-auto max-w-7xl lg:px-8">
        <div class="max-w-2xl mx-auto text-center">
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Professional iPhone Repair Services
          </h1>
          <p class="mt-6 text-lg leading-8 text-blue-100">
            Fast, reliable, and affordable iPhone repairs with premium quality parts and warranty.
          </p>
          <div class="flex items-center justify-center mt-10 gap-x-6">
            <router-link
              to="/repair-form"
              class="px-6 py-3 text-lg font-semibold text-blue-600 bg-white rounded-md shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Request Repair Now
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Services Section -->
    <div class="py-16 sm:py-24">
      <div class="px-6 mx-auto max-w-7xl lg:px-8">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our Repair Services
          </h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            We offer a wide range of repair services for all iPhone models with premium quality parts and skilled technicians.
          </p>
        </div>
        <div class="max-w-2xl mx-auto mt-16 sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div class="flex flex-col">
              <dt class="text-xl font-semibold leading-7 text-gray-900">
                <div class="flex items-center justify-center w-10 h-10 mb-6 rounded-lg bg-primary">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                  </svg>
                </div>
                Screen Replacement
              </dt>
              <dd class="flex flex-col flex-auto mt-1 text-base leading-7 text-gray-600">
                <p class="flex-auto">
                  Cracked or broken screen? We offer both OEM and aftermarket screen replacements for all iPhone models with a warranty.
                </p>
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-xl font-semibold leading-7 text-gray-900">
                <div class="flex items-center justify-center w-10 h-10 mb-6 rounded-lg bg-primary">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 10.5h.375c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125H21M4.5 10.5H18V15H4.5v-4.5zM3.75 18h15A2.25 2.25 0 0021 15.75v-6a2.25 2.25 0 00-2.25-2.25h-15A2.25 2.25 0 001.5 9.75v6A2.25 2.25 0 003.75 18z" />
                  </svg>
                </div>
                Battery Replacement
              </dt>
              <dd class="flex flex-col flex-auto mt-1 text-base leading-7 text-gray-600">
                <p class="flex-auto">
                  Experiencing poor battery life? We can replace your iPhone battery with genuine or high-quality aftermarket options.
                </p>
              </dd>
            </div>
            <div class="flex flex-col">
              <dt class="text-xl font-semibold leading-7 text-gray-900">
                <div class="flex items-center justify-center w-10 h-10 mb-6 rounded-lg bg-primary">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                Speaker & Audio Repairs
              </dt>
              <dd class="flex flex-col flex-auto mt-1 text-base leading-7 text-gray-600">
                <p class="flex-auto">
                  Having trouble with your iPhone speakers or microphones? We can diagnose and replace any audio components.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- Why Choose Us Section -->
    <div class="py-16 bg-gray-50 sm:py-24">
      <div class="px-6 mx-auto max-w-7xl lg:px-8">
        <div class="max-w-2xl mx-auto lg:text-center">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose REGEN Repairs?
          </h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">
            We offer the best quality repairs with transparent pricing and exceptional customer service.
          </p>
        </div>
        <div class="max-w-2xl mx-auto mt-16 sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            <div class="relative pl-16">
              <dt class="text-base font-semibold leading-7 text-gray-900">
                <div class="absolute top-0 left-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Fast Turnaround Times
              </dt>
              <dd class="mt-2 text-base leading-7 text-gray-600">
                Most repairs are completed within 1-2 hours. We value your time and work efficiently to get your device back to you as quickly as possible.
              </dd>
            </div>
            <div class="relative pl-16">
              <dt class="text-base font-semibold leading-7 text-gray-900">
                <div class="absolute top-0 left-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                Quality Parts & Warranty
              </dt>
              <dd class="mt-2 text-base leading-7 text-gray-600">
                We use only genuine OEM or high-quality aftermarket parts for all repairs. Our repairs come with a warranty for your peace of mind.
              </dd>
            </div>
            <div class="relative pl-16">
              <dt class="text-base font-semibold leading-7 text-gray-900">
                <div class="absolute top-0 left-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Transparent Pricing
              </dt>
              <dd class="mt-2 text-base leading-7 text-gray-600">
                No hidden fees or surprises. We provide clear pricing upfront for all our repair services. You'll know exactly what you're paying for.
              </dd>
            </div>
            <div class="relative pl-16">
              <dt class="text-base font-semibold leading-7 text-gray-900">
                <div class="absolute top-0 left-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                </div>
                Pickup & Delivery
              </dt>
              <dd class="mt-2 text-base leading-7 text-gray-600">
                We offer convenient pickup and delivery services within Lahore. Save time and let us come to you for a hassle-free repair experience.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="rounded-lg bg-primary">
      <div class="px-6 py-16 mx-auto text-center max-w-7xl sm:py-20 lg:px-8">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to get your iPhone fixed?
        </h2>
        <p class="mt-4 text-lg leading-6 text-blue-100">
          Our expert technicians are ready to help you with any iPhone repair needs.
        </p>
        <router-link
          to="/repair-form"
          class="inline-flex items-center justify-center px-8 py-3 mt-8 text-base font-medium bg-white border border-transparent rounded-md text-primary hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
        >
          Request a Repair
        </router-link>
      </div>
    </div>
  </div>
</template>