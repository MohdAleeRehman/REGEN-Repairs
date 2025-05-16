<template>
  <div>
    <!-- Dashboard Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
      <!-- Pending Submissions Card -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Pending Submissions</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ pendingCount }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 bg-gray-50">
          <router-link to="/admin/submissions?status=pending" class="text-sm font-medium text-primary hover:text-blue-700">
            View all
          </router-link>
        </div>
      </div>

      <!-- In Progress Card -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 019 14.437V9.564z" />
              </svg>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ inProgressCount }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 bg-gray-50">
          <router-link to="/admin/submissions?status=in_progress" class="text-sm font-medium text-primary hover:text-blue-700">
            View all
          </router-link>
        </div>
      </div>

      <!-- Completed Card -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Completed</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ completedCount }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 bg-gray-50">
          <router-link to="/admin/submissions?status=completed" class="text-sm font-medium text-primary hover:text-blue-700">
            View all
          </router-link>
        </div>
      </div>

      <!-- Partial Submissions Card -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Partial Submissions</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ partialCount }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 bg-gray-50">
          <router-link to="/admin/partial-submissions" class="text-sm font-medium text-primary hover:text-blue-700">
            View all
          </router-link>
        </div>
      </div>
      
      <!-- Devices Card -->
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              </svg>
            </div>
            <div class="flex-1 w-0 ml-5">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Devices</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ deviceStore.devices.length }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="px-5 py-3 bg-gray-50">
          <router-link to="/admin/devices" class="text-sm font-medium text-primary hover:text-blue-700">
            Manage devices
          </router-link>
        </div>
      </div>
    </div>

    <!-- Admin Actions -->
    <div class="grid grid-cols-1 gap-5 mt-8 sm:grid-cols-2">
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <h3 class="mb-2 text-lg font-medium text-gray-900">Device Management</h3>
          <p class="mb-4 text-sm text-gray-500">Add, edit, or remove devices and manage their pricing.</p>
          <router-link 
            to="/admin/devices" 
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-blue-700"
          >
            Manage Devices
          </router-link>
        </div>
      </div>
      
      <div class="overflow-hidden bg-white rounded-lg shadow">
        <div class="p-5">
          <h3 class="mb-2 text-lg font-medium text-gray-900">Repair Submissions</h3>
          <p class="mb-4 text-sm text-gray-500">View and manage all customer repair submissions.</p>
          <router-link 
            to="/admin/submissions" 
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-primary hover:bg-blue-700"
          >
            View Submissions
          </router-link>
        </div>
      </div>
    </div>

    <!-- Analytics Charts -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900">Analytics Overview</h2>
      <div v-if="isLoading" class="p-6 text-center">
        <p class="text-gray-500">Loading charts...</p>
      </div>
      <div v-else-if="error" class="p-6 text-center">
        <p class="text-red-500">{{ error }}</p>
      </div>
      <div v-else-if="!submissions || submissions.length === 0" class="p-6 text-center">
        <p class="text-gray-500">No data available for charts</p>
      </div>
      <DashboardCharts 
        v-else 
        :submissions="submissions"
        :key="chartKey" 
      />
    </div>

    <!-- Recent Submissions -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900">Recent Submissions</h2>
      <div class="mt-4 overflow-hidden bg-white rounded-lg shadow">
        <div v-if="isLoading" class="p-6 text-center">
          <p class="text-gray-500">Loading...</p>
        </div>
        <div v-else-if="error" class="p-6 text-center">
          <p class="text-red-500">{{ error }}</p>
        </div>
        <div v-else-if="recentSubmissions.length === 0" class="p-6 text-center">
          <p class="text-gray-500">No recent submissions found.</p>
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Device
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Date
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="submission in recentSubmissions" :key="submission.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <ProfileAvatar :name="submission.name || 'Unknown'" size="sm" />
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ submission.name }}</div>
                    <div class="text-sm text-gray-500">{{ submission.whatsapp_number }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 mr-3 bg-white border rounded-md overflow-hidden flex items-center justify-center">
                    <img 
                      v-if="getDeviceImage(submission.device_id)" 
                      :src="getDeviceImage(submission.device_id)" 
                      :alt="getDeviceName(submission.device_id)"
                      class="h-8 w-auto object-contain"
                      loading="lazy"
                    />
                    <div v-else class="flex items-center justify-center h-full w-full bg-gray-50">
                      <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-900">{{ getDeviceName(submission.device_id) }}</div>
                    <div class="text-sm text-gray-500">
                      {{ submission.problems.join(', ') }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full" :class="getStatusClass(submission.status)">
                  {{ formatStatus(submission.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {{ formatDate(submission.created_at) }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                <router-link :to="`/admin/submissions/${submission.id}`" class="text-primary hover:text-blue-900">
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination Controls for Recent Submissions -->
        <div class="px-4 py-3 bg-gray-50 sm:px-6 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentSubmissionsPage > 1 ? currentSubmissionsPage-- : null"
              :disabled="currentSubmissionsPage <= 1"
              :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                currentSubmissionsPage <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-gray-100'
              ]"
            >
              Previous
            </button>
            <button
              @click="currentSubmissionsPage < totalSubmissionsPages ? currentSubmissionsPage++ : null"
              :disabled="currentSubmissionsPage >= totalSubmissionsPages"
              :class="[
                'relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                currentSubmissionsPage >= totalSubmissionsPages ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-gray-100'
              ]"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <router-link to="/admin/submissions" class="text-sm font-medium text-primary hover:text-blue-700">
                View all submissions
              </router-link>
            </div>
            <div v-if="totalSubmissionsPages > 1">
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  @click="currentSubmissionsPage > 1 ? currentSubmissionsPage-- : null"
                  :disabled="currentSubmissionsPage <= 1"
                  class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  :class="{ 'cursor-not-allowed': currentSubmissionsPage <= 1 }"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <button
                  v-for="page in totalSubmissionsPages"
                  :key="'submission-page-' + page"
                  @click="currentSubmissionsPage = page"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                    currentSubmissionsPage === page
                      ? 'bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                  ]"
                >
                  {{ page }}
                </button>
                
                <button
                  @click="currentSubmissionsPage < totalSubmissionsPages ? currentSubmissionsPage++ : null"
                  :disabled="currentSubmissionsPage >= totalSubmissionsPages"
                  class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  :class="{ 'cursor-not-allowed': currentSubmissionsPage >= totalSubmissionsPages }"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Partial Submissions -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900">Partial Submissions</h2>
      <p class="mt-1 text-sm text-gray-500">Users who started but didn't complete the form</p>
      <div class="mt-4 overflow-hidden bg-white rounded-lg shadow">
        <div v-if="isLoading" class="p-6 text-center">
          <p class="text-gray-500">Loading...</p>
        </div>
        <div v-else-if="error" class="p-6 text-center">
          <p class="text-red-500">{{ error }}</p>
        </div>
        <div v-else-if="recentPartialSubmissions.length === 0" class="p-6 text-center">
          <p class="text-gray-500">No partial submissions found.</p>
        </div>
        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Device
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Last Completed Step
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Problems
              </th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                Date
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">View</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="submission in recentPartialSubmissions" :key="submission.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0 mr-3 bg-white border rounded-md overflow-hidden flex items-center justify-center">
                    <img 
                      v-if="getDeviceImage(submission.device_id)" 
                      :src="getDeviceImage(submission.device_id)" 
                      :alt="getDeviceName(submission.device_id)"
                      class="h-8 w-auto object-contain"
                      loading="lazy"
                    />
                    <div v-else class="flex items-center justify-center h-full w-full bg-gray-50">
                      <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm text-gray-900">{{ getDeviceName(submission.device_id) }}</div>
                    <div v-if="submission.whatsapp_number" class="text-sm text-gray-500">
                      {{ submission.whatsapp_number }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium">
                  Step {{ submission.last_completed_step }} of 5
                </div>
                <div class="text-xs text-gray-500">
                  {{ getStepName(submission.last_completed_step) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="submission.problems && submission.problems.length > 0" class="text-sm text-gray-500">
                  {{ submission.problems.join(', ') }}
                </div>
                <div v-else class="text-xs italic text-gray-400">
                  No problems selected
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {{ formatDate(submission.created_at) }}
              </td>
              <td class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                <router-link :to="`/admin/submissions/${submission.id}`" class="text-primary hover:text-blue-900">
                  View
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- Pagination Controls for Partial Submissions -->
        <div class="px-4 py-3 bg-gray-50 sm:px-6 flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="currentPartialPage > 1 ? currentPartialPage-- : null"
              :disabled="currentPartialPage <= 1"
              :class="[
                'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                currentPartialPage <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-gray-100'
              ]"
            >
              Previous
            </button>
            <button
              @click="currentPartialPage < totalPartialPages ? currentPartialPage++ : null"
              :disabled="currentPartialPage >= totalPartialPages"
              :class="[
                'relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                currentPartialPage >= totalPartialPages ? 'text-gray-300 cursor-not-allowed' : 'text-primary hover:bg-gray-100'
              ]"
            >
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <router-link to="/admin/partial-submissions" class="text-sm font-medium text-primary hover:text-blue-700">
                View all partial submissions
              </router-link>
            </div>
            <div v-if="totalPartialPages > 1">
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  @click="currentPartialPage > 1 ? currentPartialPage-- : null"
                  :disabled="currentPartialPage <= 1"
                  class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  :class="{ 'cursor-not-allowed': currentPartialPage <= 1 }"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                  </svg>
                </button>
                
                <button
                  v-for="page in totalPartialPages"
                  :key="'partial-page-' + page"
                  @click="currentPartialPage = page"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                    currentPartialPage === page
                      ? 'bg-primary text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                  ]"
                >
                  {{ page }}
                </button>
                
                <button
                  @click="currentPartialPage < totalPartialPages ? currentPartialPage++ : null"
                  :disabled="currentPartialPage >= totalPartialPages"
                  class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                  :class="{ 'cursor-not-allowed': currentPartialPage >= totalPartialPages }"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRepairStore } from '../../store/repairStore';
import { useDeviceStore } from '../../store/deviceStore';
import DashboardCharts from '../../components/ui/DashboardCharts.vue';
import ProfileAvatar from '../../components/ui/ProfileAvatar.vue';

const repairStore = useRepairStore();
const deviceStore = useDeviceStore();

const isLoading = ref(false);
const error = ref(null);
const submissions = ref([]);  // Initialize as empty array to ensure it's always valid
const chartKey = ref(0); // Key to force chart re-rendering when data changes

// Pagination for recent submissions
const currentSubmissionsPage = ref(1);
const submissionsPerPage = ref(5);

// Pagination for partial submissions
const currentPartialPage = ref(1);
const partialPerPage = ref(5);

// Fetch data
const fetchData = async () => {
  isLoading.value = true;
  error.value = null; // Reset error state
  
  try {
    // Fetch devices and submissions sequentially
    await deviceStore.fetchDevices();
    await repairStore.fetchSubmissions();
    
    // Ensure submissions is always an array
    if (Array.isArray(repairStore.submissions)) {
      submissions.value = repairStore.submissions;
      console.log('Dashboard: Loaded submissions:', submissions.value.length);
    } else {
      submissions.value = [];
      console.warn('Repair store submissions is not an array:', repairStore.submissions);
    }
    
    // Increment chart key to force re-render of charts
    chartKey.value++;
  } catch (err) {
    error.value = err.message || 'Failed to load data';
    console.error('Error fetching data:', err);
    submissions.value = []; // Ensure submissions is reset to empty array on error
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);

// Refresh data when repair store submissions change
watch(() => repairStore.submissions, (newSubmissions) => {
  if (Array.isArray(newSubmissions)) {
    submissions.value = newSubmissions;
    console.log('Dashboard watch: Updated submissions', newSubmissions.length);
  } else {
    // If newSubmissions is not an array, set to empty array
    submissions.value = [];
    console.warn('Watch detected non-array submissions:', newSubmissions);
  }
  
  // Increment chart key to force re-render of charts
  chartKey.value++;
}, { deep: true });

// Calculate counts
const pendingCount = computed(() => {
  return submissions.value.filter(sub => sub.status === 'pending').length;
});

const inProgressCount = computed(() => {
  return submissions.value.filter(sub => sub.status === 'in_progress').length;
});

const completedCount = computed(() => {
  return submissions.value.filter(sub => sub.status === 'completed').length;
});

// Count for partial submissions
const partialCount = computed(() => {
  return submissions.value.filter(sub => sub.status === 'partial' || sub.is_partial === true).length;
});

// All filtered submissions (complete ones)
const filteredSubmissions = computed(() => {
  return [...submissions.value]
    .filter(sub => sub.status !== 'partial' && !sub.is_partial)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

// All filtered partial submissions
const filteredPartialSubmissions = computed(() => {
  return [...submissions.value]
    .filter(sub => sub.status === 'partial' || sub.is_partial === true)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

// Pagination for recent submissions
const totalSubmissionsPages = computed(() => Math.ceil(filteredSubmissions.value.length / submissionsPerPage.value));
const recentSubmissions = computed(() => {
  const start = (currentSubmissionsPage.value - 1) * submissionsPerPage.value;
  const end = start + submissionsPerPage.value;
  return filteredSubmissions.value.slice(start, end);
});

// Pagination for partial submissions
const totalPartialPages = computed(() => Math.ceil(filteredPartialSubmissions.value.length / partialPerPage.value));
const recentPartialSubmissions = computed(() => {
  const start = (currentPartialPage.value - 1) * partialPerPage.value;
  const end = start + partialPerPage.value;
  return filteredPartialSubmissions.value.slice(start, end);
});

// Helper functions
const getDeviceName = (deviceId) => {
  const device = deviceStore.getDeviceById(deviceId);
  return device ? device.model : 'Unknown Device';
};

// Get device image from device store
const getDeviceImage = (deviceId) => {
  if (!deviceId) return null;
  try {
    const device = deviceStore.getDeviceById(deviceId);
    return device?.image_url || null;
  } catch (error) {
    console.error('Error getting device image:', error);
    return null;
  }
};

const formatStatus = (status) => {
  switch (status) {
    case 'pending': return 'Pending';
    case 'in_progress': return 'In Progress';
    case 'completed': return 'Completed';
    case 'cancelled': return 'Cancelled';
    case 'partial': return 'Partial';
    default: return status;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'in_progress': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    case 'partial': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get the name of the step from step number
const getStepName = (stepNumber) => {
  const stepNames = [
    'Device Selection',
    'Problem Selection',
    'Problem Details',
    'Service History',
    'Contact & Terms'
  ];
  
  return stepNames[stepNumber - 1] || 'Unknown Step';
};
</script>