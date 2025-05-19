import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/authStore';

// Import views
import Home from '../views/Home.vue';
import RepairForm from '../views/RepairForm.vue';
import Success from '../views/Success.vue';
import Terms from '../views/Terms.vue';
import Admin from '../views/Admin.vue';
import Dashboard from '../views/admin/Dashboard.vue';
import Submissions from '../views/admin/Submissions.vue';
import SubmissionDetail from '../views/admin/SubmissionDetail.vue';
import DeviceManagement from '../views/admin/DeviceManagement.vue';
import NotFound from '../views/NotFound.vue';

// Define routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/repair-form',
    name: 'RepairForm',
    component: RepairForm,
  },
  {
    path: '/success',
    name: 'Success',
    component: Success,
  },
  {
    path: '/terms',
    name: 'Terms',
    component: Terms,
  },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: Dashboard,
      },
      {
        path: 'submissions',
        name: 'AdminSubmissions',
        component: Submissions,
        props: { showPartial: false }
      },
      {
        path: 'partial-submissions',
        name: 'PartialSubmissions',
        component: Submissions,
        props: { showPartial: true }
      },
      {
        path: 'submissions/:id',
        name: 'SubmissionDetail',
        component: SubmissionDetail,
        props: true,
      },
      {
        path: 'devices',
        name: 'DeviceManagement',
        component: DeviceManagement,
      },
    ],
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/Login.vue'),
  },
  {
    path: '/admin/signup',
    name: 'AdminSignup',
    component: () => import('../views/admin/Signup.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
];

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Always scroll to top
    return { top: 0 };
  },
});

// Configure back gesture behavior for multi-step forms
router.beforeResolve((to, from, next) => {
  // If we're navigating from RepairForm to another page using swipe gesture or browser back button
  if (from.name === 'RepairForm' && to.name !== 'RepairForm') {
    // Check if we're in a multi-step form
    const repairStore = window?.__pinia?.state?.value?.repair;
    if (repairStore && repairStore.currentStep > 1) {
      // Prevent navigation and go back one step instead
      next(false);
      // Get the repair store instance and go back one step
      try {
        const pinia = window.__pinia;
        // Check if the store is available and has a previousStep method
        if (pinia && pinia.state?.value?.repair) {
          const store = pinia._s.get('repair') || pinia.state.value.repair._p?.stores?.repair;
          if (store && typeof store.previousStep === 'function') {
            store.previousStep();
            
            // Update history state to prevent confusion with the back button
            window.history.pushState(null, '', window.location.pathname);
          }
        }
      } catch (err) {
        console.error('Error handling navigation:', err);
      }
      return;
    }
  }
  next();
});

// Add navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialize auth state if not already done
  if (!authStore.isAuthenticated) {
    try {
      await authStore.initAuth();
    } catch (error) {
      console.error('Auth initialization failed:', error);
    }
  }
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is authenticated and is admin
    if (!authStore.isAuthenticated || !authStore.isAdmin) {
      // Redirect to login page with return URL
      next({ 
        name: 'AdminLogin', 
        query: { redirect: to.fullPath } 
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;