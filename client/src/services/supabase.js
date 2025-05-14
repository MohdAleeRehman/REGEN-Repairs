import { createClient } from '@supabase/supabase-js';

// Supabase client configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://iconztzeoztncnojkmoy.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb256dHplb3p0bmNub2prbW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTM4NzksImV4cCI6MjA2MDAyOTg3OX0.Gb0C7hkvzWMSaxvKI-P1SfdPY36Yg7qkSPUvGuWP0KE';

// Create a single supabase client for the entire app
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Export Supabase auth methods with proper error handling
export const auth = {
  // Sign up a new user
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign in a user
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  },
  
  // Sign out the current user
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  // Get the current user session
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  
  // Get the current user
  async getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
  
  // Check if user has admin role (based on user_metadata)
  async isAdmin() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    // Check user metadata or custom claims for admin role
    return data.user?.user_metadata?.role === 'admin';
  }
};

// Database operations
export const db = {
  // Devices
  // NOTE: Direct device operations should use the server API through api.devices
  // to bypass RLS policies by using the server's service role key
  async getDevices() {
    console.warn('DEPRECATED: Direct Supabase device queries are deprecated. Use api.devices.getAll() instead to prevent RLS violations');
    try {
      // Use the API client instead of direct Supabase call
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/devices`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch devices:', error);
      throw error;
    }
  },
  
  async getDeviceById(id) {
    console.warn('DEPRECATED: Direct Supabase device queries are deprecated. Use api.devices.getById() instead to prevent RLS violations');
    try {
      // Use the API client instead of direct Supabase call
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/devices/${id}`);
      if (!response.ok) throw new Error('Failed to fetch device');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch device:', error);
      throw error;
    }
  },
  
  async addDevice(device) {
    console.warn('DEPRECATED: Direct Supabase device operations are deprecated. Use api.devices.create() instead to prevent RLS violations');
    try {
      // Use the API client instead of direct Supabase call
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device)
      });
      if (!response.ok) throw new Error('Failed to add device');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to add device:', error);
      throw error;
    }
  },
  
  async updateDevice(device) {
    console.warn('DEPRECATED: Direct Supabase device operations are deprecated. Use api.devices.update() instead to prevent RLS violations');
    try {
      // Use the API client instead of direct Supabase call
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/devices/${device.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device)
      });
      if (!response.ok) throw new Error('Failed to update device');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to update device:', error);
      throw error;
    }
  },
  
  async deleteDevice(id) {
    console.warn('DEPRECATED: Direct Supabase device operations are deprecated. Use api.devices.delete() instead to prevent RLS violations');
    try {
      // Use the API client instead of direct Supabase call
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/devices/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete device');
      return true;
    } catch (error) {
      console.error('Failed to delete device:', error);
      throw error;
    }
  },
  
  // Submissions
  async getSubmissions() {
    const { data, error } = await supabase
      .from('submissions')
      .select('*, device:devices(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getSubmissionById(id) {
    const { data, error } = await supabase
      .from('submissions')
      .select('*, device:devices(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async createSubmission(submission) {
    const { data, error } = await supabase
      .from('submissions')
      .insert([submission])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async updateSubmission(id, updates) {
    const { data, error } = await supabase
      .from('submissions')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async deleteSubmission(id) {
    const { error } = await supabase
      .from('submissions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};