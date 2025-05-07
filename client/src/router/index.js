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

// Add navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Initialize auth state from localStorage
  if (!authStore.isAuthenticated) {
    authStore.initAuth();
  }
  
  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is authenticated
    if (!authStore.isAdmin) {
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