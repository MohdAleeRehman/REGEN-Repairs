const { createClient } = require('@supabase/supabase-js');

// Make sure environment variables are properly loaded
const supabaseUrl = process.env.SUPABASE_URL || "https://iconztzeoztncnojkmoy.supabase.co";
// Use service role key for admin operations like data imports
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imljb256dHplb3p0bmNub2prbW95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0NTM4NzksImV4cCI6MjA2MDAyOTg3OX0.Gb0C7hkvzWMSaxvKI-P1SfdPY36Yg7qkSPUvGuWP0KE";

// Determine which key to use - for admin operations use service key
const keyToUse = process.env.USE_SERVICE_KEY === 'true' ? supabaseServiceKey : supabaseAnonKey;

// Validate that we have the required values
if (!supabaseUrl || !keyToUse) {
  throw new Error('Supabase URL and key are required');
}

// Create the Supabase client with explicit options
const supabase = createClient(supabaseUrl, keyToUse, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

module.exports = supabase;