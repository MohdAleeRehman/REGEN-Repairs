import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { useAuthStore } from './store/authStore'

// Performance metrics
const perfStart = performance.now()

// Create app
const app = createApp(App)
const pinia = createPinia()

// Use features
app.use(pinia)
app.use(router)

// Initialize auth store
const authStore = useAuthStore(pinia)

// Add error tracking
app.config.errorHandler = (err, instance, info) => {
  console.error(`App Error: ${err}`, info)
  // Here you could send to an error monitoring service if needed
}

// Only initialize auth if needed for current route
const currentRoute = router.currentRoute.value
const isAuthRequired = !['/', '/repair-form', '/terms'].includes(currentRoute.path)

if (isAuthRequired) {
  authStore.initAuth()
} else {
  // Defer auth initialization for faster initial load on public pages
  setTimeout(() => {
    authStore.initAuth()
  }, 1000)
}

// Mount the app
app.mount('#app')

// Log performance metric for initial load
window.addEventListener('load', () => {
  const perfEnd = performance.now()
  console.log(`App initialization took ${Math.round(perfEnd - perfStart)}ms`)
})
