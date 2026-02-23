import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wjiksbucqaoeysdpqnmc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8SmhHBzsVQBhQ-Jqedq3Kw_bT1k_IMC';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
