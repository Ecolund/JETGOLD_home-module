import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '../types';

// Environment variable validation with detailed logging
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Supabase Environment Check:');
console.log('- URL exists:', !!supabaseUrl);
console.log('- URL value:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'undefined');
console.log('- Anon Key exists:', !!supabaseAnonKey);
console.log('- Anon Key value:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'undefined');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  throw new Error(
    'Missing Supabase environment variables. Please ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in your .env file.'
  );
}

console.log('🚀 Initializing Supabase client...');

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      'X-Client-Info': 'jetgold-home-module',
    },
  },
});

console.log('✅ Supabase client initialized');

// Network connectivity test
export const testNetworkConnectivity = async (): Promise<boolean> => {
  try {
    console.log('🌐 Testing network connectivity...');
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      timeout: 5000,
    });
    const isConnected = response.ok;
    console.log('🌐 Network connectivity:', isConnected ? '✅ Connected' : '❌ Failed');
    return isConnected;
  } catch (error) {
    console.error('🌐 Network connectivity test failed:', error);
    return false;
  }
};

// Supabase connection test
// Verify connection on initialization
export const verifySupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // First test basic connectivity
    const networkOk = await testNetworkConnectivity();
    if (!networkOk) {
      console.error('❌ Network connectivity failed - cannot reach external services');
      return false;
    }

    // Test Supabase endpoint specifically
    const supabaseHealthUrl = `${supabaseUrl}/rest/v1/`;
    console.log('🔍 Testing Supabase endpoint:', supabaseHealthUrl);
    
    const healthResponse = await fetch(supabaseHealthUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      timeout: 10000,
    });
    
    console.log('🔍 Supabase endpoint response status:', healthResponse.status);
    
    if (!healthResponse.ok) {
      console.error('❌ Supabase endpoint not reachable:', healthResponse.statusText);
      return false;
    }

    // Test actual table query
    console.log('🔍 Testing home_features table query...');
    const { data, error } = await supabase
      .from('home_features')
      .select('count')
      .limit(1);
    
      .from('home_features')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Supabase table query failed:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return false;
    }
    
    console.log('✅ Supabase connection verified successfully');
    
    console.log('✅ Supabase connection successful');
    console.log('📊 Query result:', data);
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed with exception:', error);
    return false;
  }
};