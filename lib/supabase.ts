import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xciyawumdtwyydelhclv.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaXlhd3VtZHR3eXlkZWxoY2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NTA1MzEsImV4cCI6MjA2MjAyNjUzMX0.jEnB9ETeZAXDzHrmpZXRhqCE2GGUefJd033KDcXgDoU';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 