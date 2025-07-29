/**
 * Network and Supabase diagnostics utilities
 */

export interface NetworkStatus {
  isOnline: boolean;
  latency?: number;
  error?: string;
}

export interface SupabaseStatus {
  isConnected: boolean;
  responseTime?: number;
  error?: string;
}

export interface ConnectionDiagnostics {
  network: NetworkStatus;
  supabase: SupabaseStatus;
  timestamp: Date;
}

/**
 * Test basic network connectivity
 */
export async function testNetworkConnectivity(): Promise<NetworkStatus> {
  const startTime = Date.now();
  
  try {
    console.log('[Diagnostics] Testing network connectivity...');
    
    const response = await fetch('https://httpbin.org/status/200', {
      method: 'GET',
      timeout: 5000,
    });
    
    const latency = Date.now() - startTime;
    
    if (response.ok) {
      console.log(`[Diagnostics] Network OK (${latency}ms)`);
      return { isOnline: true, latency };
    } else {
      const error = `HTTP ${response.status}`;
      console.log(`[Diagnostics] Network error: ${error}`);
      return { isOnline: false, error };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`[Diagnostics] Network failed: ${errorMessage}`);
    return { isOnline: false, error: errorMessage };
  }
}

/**
 * Test Supabase endpoint connectivity
 */
export async function testSupabaseConnectivity(supabaseUrl: string): Promise<SupabaseStatus> {
  const startTime = Date.now();
  
  try {
    console.log('[Diagnostics] Testing Supabase connectivity...');
    
    const healthUrl = `${supabaseUrl}/rest/v1/`;
    const response = await fetch(healthUrl, {
      method: 'GET',
      timeout: 5000,
    });
    
    const responseTime = Date.now() - startTime;
    
    if (response.ok || response.status === 401) {
      // 401 is expected for unauthenticated requests to Supabase
      console.log(`[Diagnostics] Supabase OK (${responseTime}ms)`);
      return { isConnected: true, responseTime };
    } else {
      const error = `HTTP ${response.status}`;
      console.log(`[Diagnostics] Supabase error: ${error}`);
      return { isConnected: false, error };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`[Diagnostics] Supabase failed: ${errorMessage}`);
    return { isConnected: false, error: errorMessage };
  }
}

/**
 * Run comprehensive connection diagnostics
 */
export async function runConnectionDiagnostics(supabaseUrl: string): Promise<ConnectionDiagnostics> {
  console.log('[Diagnostics] Running connection diagnostics...');
  
  const [network, supabase] = await Promise.all([
    testNetworkConnectivity(),
    testSupabaseConnectivity(supabaseUrl),
  ]);
  
  const diagnostics: ConnectionDiagnostics = {
    network,
    supabase,
    timestamp: new Date(),
  };
  
  console.log('[Diagnostics] Results:', diagnostics);
  return diagnostics;
}