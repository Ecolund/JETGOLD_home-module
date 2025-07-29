import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface HomeFeature {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches home features from Supabase, ordered by the 'order' field ascending
 * @returns Promise<HomeFeature[]> - Array of home features
 * @throws Error if the query fails
 */
export async function getHomeFeatures(): Promise<HomeFeature[]> {
  try {
    const { data, error } = await supabase
      .from('home_features')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch home features: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching home features');
  }
}

/**
 * Creates a new home feature
 * @param feature - Partial HomeFeature object (without id, created_at, updated_at)
 * @returns Promise<HomeFeature> - The created feature
 * @throws Error if the creation fails
 */
export async function createHomeFeature(
  feature: Omit<HomeFeature, 'id' | 'created_at' | 'updated_at'>
): Promise<HomeFeature> {
  try {
    const { data, error } = await supabase
      .from('home_features')
      .insert([feature])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create home feature: ${error.message}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while creating home feature');
  }
}

/**
 * Updates an existing home feature
 * @param id - Feature ID to update
 * @param updates - Partial HomeFeature object with updates
 * @returns Promise<HomeFeature> - The updated feature
 * @throws Error if the update fails
 */
export async function updateHomeFeature(
  id: string,
  updates: Partial<Omit<HomeFeature, 'id' | 'created_at' | 'updated_at'>>
): Promise<HomeFeature> {
  try {
    const { data, error } = await supabase
      .from('home_features')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update home feature: ${error.message}`);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while updating home feature');
  }
}

/**
 * Deletes a home feature
 * @param id - Feature ID to delete
 * @returns Promise<void>
 * @throws Error if the deletion fails
 */
export async function deleteHomeFeature(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('home_features')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete home feature: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while deleting home feature');
  }
}