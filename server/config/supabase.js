const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Ensure environment variables are loaded
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
const envPath = path.resolve(process.cwd(), envFile);

// Load environment variables if not already loaded
if (!process.env.SUPABASE_URL) {
  console.log(`Loading environment from ${envPath} for Supabase configuration`);
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
  } else {
    console.warn(`Environment file ${envPath} not found for Supabase config, using defaults`);
    dotenv.config();
  }
}

// Make sure environment variables are properly loaded
const supabaseUrl = process.env.SUPABASE_URL || "https://iconztzeoztncnojkmoy.supabase.co";
// Use service role key for admin operations like data imports
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb256dHplb3p0bmNub2prbW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTM4NzksImV4cCI6MjA2MDAyOTg3OX0.Gb0C7hkvzWMSaxvKI-P1SfdPY36Yg7qkSPUvGuWP0KE";

// Determine which key to use - use service key by default for server operations
const keyToUse = supabaseServiceKey || supabaseAnonKey;

// Log configuration (without the actual keys for security)
console.log(`Supabase Configuration: URL=${supabaseUrl}, Using service role key for server operations`);

// Validate that we have the required values
if (!supabaseUrl || !keyToUse) {
  console.error('Supabase URL and key are required');
  throw new Error('Supabase URL and key are required');
}

try {
  // Create the Supabase client with explicit options
  const supabase = createClient(supabaseUrl, keyToUse, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  });
  
  // Test the connection
  console.log('Supabase client initialized successfully');
  
  module.exports = supabase;
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  throw error;
}