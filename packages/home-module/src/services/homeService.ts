import { supabase } from '../utils/supabase';

export interface HomeFeature {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  order: number;
  created_at: string;
  updated_at: string;
}

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
  try {
    const { data, error } = await supabase
      .from('home_features')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching home features:', error);
      throw new Error(`Failed to fetch home features: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error in getHomeFeatures:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

/**
 * Creates a new home feature
 * @param feature - The feature data to create
 * @returns Promise<HomeFeature> - The created feature
 * @throws Error if creation fails
 */
export const createHomeFeature = async (feature: CreateHomeFeatureInput): Promise<HomeFeature> => {
  try {
    const { data, error } = await supabase
      .from('home_features')
      .insert([feature])
      .select()
      .single();

    if (error) {
      console.error('Error creating home feature:', error);
      throw new Error(`Failed to create home feature: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in createHomeFeature:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

/**
 * Updates an existing home feature
 * @param feature - The feature data to update (must include id)
 * @returns Promise<HomeFeature> - The updated feature
 * @throws Error if update fails
 */
export const updateHomeFeature = async (feature: UpdateHomeFeatureInput): Promise<HomeFeature> => {
  try {
    const { id, ...updateData } = feature;
    const { data, error } = await supabase
      .from('home_features')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating home feature:', error);
      throw new Error(`Failed to update home feature: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Unexpected error in updateHomeFeature:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};

/**
 * Deletes a home feature by ID
 * @param id - The ID of the feature to delete
 * @returns Promise<void>
 * @throws Error if deletion fails
 */
export const deleteHomeFeature = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('home_features')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting home feature:', error);
      throw new Error(`Failed to delete home feature: ${error.message}`);
    }
  } catch (error) {
    console.error('Unexpected error in deleteHomeFeature:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
};