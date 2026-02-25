import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('--- Supabase Diagnostic ---');
console.log('URL:', supabaseUrl || 'https://wjiksbucqaoeysdpqnmc.supabase.co');
console.log('Key:', (supabaseAnonKey || 'eyJhbGci...').substring(0, 20) + '...');

export const supabase = createClient(
    supabaseUrl || 'https://wjiksbucqaoeysdpqnmc.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqaWtzYnVjcWFvZXlzZHBxbm1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjcwODcsImV4cCI6MjA4NjkwMzA4N30.yXmrziJeXbI_JhuFRNKzXnBtn-cYPJa-mFCv5JBzd5w',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true
        }
    }
);
