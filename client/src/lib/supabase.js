import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Not set');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // ไม่ใช้ Supabase auth session
    autoRefreshToken: false,
  },
  global: {
    headers: {
      // ใช้ JWT token จาก localStorage
      get Authorization() {
        const token = localStorage.getItem('token');
        return token ? `Bearer ${token}` : '';
      }
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

console.log('✅ Supabase client initialized');

// Function สำหรับ set session จาก JWT token
export const setSupabaseSession = async (jwtToken) => {
  if (!jwtToken) return;
  
  try {
    // Set session ใน Supabase client
    const { data, error } = await supabase.auth.setSession({
      access_token: jwtToken,
      refresh_token: jwtToken
    });
    
    if (error) {
      console.error('❌ Failed to set Supabase session:', error);
    } else {
      console.log('✅ Supabase session set successfully');
    }
  } catch (error) {
    console.error('❌ Error setting Supabase session:', error);
  }
};


