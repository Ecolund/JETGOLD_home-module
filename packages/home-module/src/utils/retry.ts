/**
 * Retry utility with exponential backoff
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  jitter?: boolean;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
}

/**
 * Sleep for a given number of milliseconds
 */
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate delay with exponential backoff and optional jitter
 */
const calculateDelay = (
  attempt: number, 
  baseDelay: number, 
  maxDelay: number, 
  backoffFactor: number, 
  jitter: boolean
): number => {
  const exponentialDelay = baseDelay * Math.pow(backoffFactor, attempt - 1);
  const delay = Math.min(exponentialDelay, maxDelay);
  
  if (jitter) {
    // Add random jitter (±25% of delay)
    const jitterAmount = delay * 0.25;
    return delay + (Math.random() * 2 - 1) * jitterAmount;
  }
  
  return delay;
};

/**
 * Retry an async operation with exponential backoff
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    jitter = true
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`[Retry] Attempt ${attempt}/${maxAttempts}`);
      const data = await operation();
      console.log(`[Retry] Success on attempt ${attempt}`);
      return { success: true, data, attempts: attempt };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.log(`[Retry] Attempt ${attempt} failed:`, lastError.message);

      if (attempt === maxAttempts) {
        console.log(`[Retry] All ${maxAttempts} attempts failed`);
        break;
      }

      const delay = calculateDelay(attempt, baseDelay, maxDelay, backoffFactor, jitter);
      console.log(`[Retry] Waiting ${Math.round(delay)}ms before retry...`);
      await sleep(delay);
    }
  }

  return { 
    success: false, 
    error: lastError || new Error('Unknown error'), 
    attempts: maxAttempts 
  };
}