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
  async getDevices() {
    // Custom sorting for newer iPhone models first
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .order('created_at', { ascending: true }); // Using created_at as a proxy for release date
    
    if (error) throw error;
    
    // Custom sort function to order devices according to the specified sequence
    const customOrder = [
      // iPhone 14 series
      'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
      // iPhone SE and 13 series
      'iPhone SE (3rd Gen)', 'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13', 'iPhone 13 mini',
      // iPhone 12 series
      'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12', 'iPhone 12 mini',
      // iPhone SE and 11 series
      'iPhone SE (2nd Gen)', 'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
      // iPhone XS and X series
      'iPhone XS Max', 'iPhone XS', 'iPhone XR', 'iPhone X',
      // iPhone 8 series
      'iPhone 8 Plus', 'iPhone 8',
      // iPhone 7 series
      'iPhone 7 Plus', 'iPhone 7'
    ];
    
    // Sort the data based on the custom order
    data.sort((a, b) => {
      const indexA = customOrder.indexOf(a.model);
      const indexB = customOrder.indexOf(b.model);
      
      // If both models are in our custom order array
      if (indexA >= 0 && indexB >= 0) {
        return indexA - indexB;
      }
      
      // If only one model is in our custom order array, prioritize it
      if (indexA >= 0) return -1;
      if (indexB >= 0) return 1;
      
      // If neither model is in our array, fall back to alphabetical ordering
      return a.model.localeCompare(b.model);
    });
    
    return data;
  },
  
  async getDeviceById(id) {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async addDevice(device) {
    const { data, error } = await supabase
      .from('devices')
      .insert([device])
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async updateDevice(device) {
    const { data, error } = await supabase
      .from('devices')
      .update(device)
      .eq('id', device.id)
      .select();
    
    if (error) throw error;
    return data[0];
  },
  
  async deleteDevice(id) {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
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