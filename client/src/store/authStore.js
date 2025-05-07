import { defineStore } from 'pinia';
import { auth } from '../services/supabase';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    session: null,
    isLoading: false,
    error: null
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
          this.user = await auth.getUser();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Login with email and password
    async login(email, password) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const { user, session } = await auth.signIn(email, password);
        this.user = user;
        this.session = session;
        
        // Check if the user is an admin
        const isAdmin = await auth.isAdmin();
        
        if (!isAdmin) {
          throw new Error('You do not have permission to access the admin panel');
        }
        
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
        await auth.signOut();
        this.user = null;
        this.session = null;
      } catch (error) {
        console.error('Error during logout:', error);
      } finally {
        this.isLoading = false;
      }
    }
  },
  
  getters: {
    // Check if user is authenticated
    isAuthenticated: (state) => !!state.session,
    
    // Check if user is admin
    isAdmin: (state) => state.user?.user_metadata?.role === 'admin'
  }
});