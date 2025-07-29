import { supabase } from '../utils/supabase';
import { HomeFeature } from '../types';

// Retry configuration
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

// Exponential backoff delay calculation
const calculateDelay = (attempt: number): number => {
  return BASE_DELAY * Math.pow(2, attempt) + Math.random() * 1000;
};

// Generic retry wrapper with exponential backoff
const withRetry = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = MAX_RETRIES
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 ${operationName} - Attempt ${attempt + 1}/${maxRetries + 1}`);
      const result = await operation();
      if (attempt > 0) {
        console.log(`✅ ${operationName} succeeded after ${attempt + 1} attempts`);
      }
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`❌ ${operationName} failed on attempt ${attempt + 1}:`, error);
      
      if (attempt < maxRetries) {
        const delay = calculateDelay(attempt);
        console.log(`⏳ Retrying ${operationName} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`💥 ${operationName} failed after ${maxRetries + 1} attempts`);
  throw lastError;
};

export interface CreateHomeFeatureInput {
  title: string;
  subtitle?: string;
  icon?: string;
  order?: number;
}

export interface UpdateHomeFeatureInput extends Partial<CreateHomeFeatureInput> {
  id: string;
}

/**
 * Fetches all home features from Supabase, ordered by the 'order' field ascending
 * @returns Promise<HomeFeature[]> - Array of home features
 * @throws Error if the query fails
 */
export const getHomeFeatures = async (): Promise<HomeFeature[]> => {
  return withRetry(async () => {
    console.log('📡 Fetching home features from Supabase...');
    
    const { data, error } = await supabase
      .from('home_features')
      .select('*')
      .order('order', { ascending: true });
    
    if (error) {
      console.error('❌ Supabase query error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      throw new Error(`Failed to fetch home features: ${error.message}`);
    }
    
    console.log('✅ Successfully fetched home features:', data?.length || 0, 'items');
    console.log('📊 Features data:', data);
    
    return data || [];
  }, 'getHomeFeatures');
};

/**
 * Creates a new home feature
 * @param feature - The feature data to create
 * @returns Promise<HomeFeature> - The created feature
 * @throws Error if creation fails
 */
export const createHomeFeature = async (feature: Omit<HomeFeature, 'id' | 'created_at' | 'updated_at'>): Promise<HomeFeature> => {
  return withRetry(async () => {
    console.log('➕ Creating home feature:', feature);
    
    const { data, error } = await supabase
      .from('home_features')
      .insert([feature])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Failed to create home feature:', error);
      throw new Error(`Failed to create home feature: ${error.message}`);
    }
    
    console.log('✅ Successfully created home feature:', data);
    return data;
  }, 'createHomeFeature');
};

/**
 * Updates an existing home feature
 * @param feature - The feature data to update (must include id)
 * @returns Promise<HomeFeature> - The updated feature
 * @throws Error if update fails
 */
export const updateHomeFeature = async (id: string, updates: Partial<HomeFeature>): Promise<HomeFeature> => {
  return withRetry(async () => {
    console.log('✏️ Updating home feature:', id, updates);
    
    const { data, error } = await supabase
      .from('home_features')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('❌ Failed to update home feature:', error);
      throw new Error(`Failed to update home feature: ${error.message}`);
    }
    
    console.log('✅ Successfully updated home feature:', data);
    return data;
  }, 'updateHomeFeature');
};

/**
 * Deletes a home feature by ID
 * @param id - The ID of the feature to delete
 * @returns Promise<void>
 * @throws Error if deletion fails
 */
export const deleteHomeFeature = async (id: string): Promise<void> => {
  return withRetry(async () => {
    console.log('🗑️ Deleting home feature:', id);
    
    const { error } = await supabase
      .from('home_features')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('❌ Failed to delete home feature:', error);
      throw new Error(`Failed to delete home feature: ${error.message}`);
    }
    
    console.log('✅ Successfully deleted home feature:', id);
  }, 'deleteHomeFeature');
};