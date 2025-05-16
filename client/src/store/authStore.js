import { defineStore } from 'pinia';
import { auth } from '../services/supabase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    isLoading: false,
    error: null,
    sessionTimeout: 30 * 60 * 1000, // 30 minutes in milliseconds
    sessionTimer: null,
    lastActivity: null
  }),
  
  actions: {
    // Check and initialize auth state
    async initAuth() {
      this.isLoading = true;
      
      try {
        // Check if there's an active session
        const session = await auth.getSession();
        
        if (session) {
          this.session = session;
          const user = await auth.getUser();
          if (user) {
            this.user = user;
            
            // Start session timeout monitoring if authenticated
            this.startSessionTimer();
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        this.session = null;
        this.user = null;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Login with email and password
    async login(email, password) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const data = await auth.signIn(email, password);
        
        if (!data) {
          throw new Error('Login failed');
        }
        
        if (data.user) {
          this.user = data.user;
        }
        
        if (data.session) {
          this.session = data.session;
        }
        
        // Check if the user is an admin
        const isAdmin = await auth.isAdmin();
        
        if (!isAdmin) {
          // Clear the session since this user is not an admin
          this.user = null;
          this.session = null;
          throw new Error('You do not have permission to access the admin panel');
        }
        
        // Start session timeout monitoring
        this.startSessionTimer();
        
        return true;
      } catch (error) {
        this.error = error.message || 'Failed to sign in';
        return false;
      } finally {
        this.isLoading = false;
      }
    },
    
    // Logout the user
    async logout() {
      this.isLoading = true;
      
      try {
        // Clear session timer
        this.clearSessionTimer();
        
        await auth.signOut();
        this.user = null;
        this.session = null;
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Start the session timeout monitoring
    startSessionTimer() {
      // Clear any existing timer
      this.clearSessionTimer();
      
      // Set last activity to current time
      this.lastActivity = Date.now();
      
      // Check session every minute
      this.sessionTimer = setInterval(() => {
        this.checkSessionTimeout();
      }, 60 * 1000); // Check every minute
      
      // Add event listeners for user activity
      window.addEventListener('mousemove', this.resetActivityTimer.bind(this));
      window.addEventListener('keypress', this.resetActivityTimer.bind(this));
      window.addEventListener('click', this.resetActivityTimer.bind(this));
      window.addEventListener('scroll', this.resetActivityTimer.bind(this));
    },
    
    // Reset the activity timer when user interacts
    resetActivityTimer() {
      this.lastActivity = Date.now();
    },
    
    // Check if session has timed out
    checkSessionTimeout() {
      if (!this.lastActivity) return;
      
      const now = Date.now();
      const timeSinceLastActivity = now - this.lastActivity;
      
      if (timeSinceLastActivity >= this.sessionTimeout) {
        console.log('Session timed out due to inactivity');
        this.logout();
        // Show timeout message to the user
        alert('Your session has expired due to inactivity. Please log in again.');
      }
    },
    
    // Clean up session timer
    clearSessionTimer() {
      if (this.sessionTimer) {
        clearInterval(this.sessionTimer);
        this.sessionTimer = null;
      }
      
      // Remove event listeners
      window.removeEventListener('mousemove', this.resetActivityTimer.bind(this));
      window.removeEventListener('keypress', this.resetActivityTimer.bind(this));
      window.removeEventListener('click', this.resetActivityTimer.bind(this));
      window.removeEventListener('scroll', this.resetActivityTimer.bind(this));
    }
  },
  
  getters: {
    // Check if user is authenticated
    isAuthenticated: (state) => !!state.session,
    
    // Check if user is admin
    isAdmin: (state) => state.user?.user_metadata?.role === 'admin'
  }
});