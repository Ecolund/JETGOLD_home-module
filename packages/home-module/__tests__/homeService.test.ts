import { getHomeFeatures, createHomeFeature, updateHomeFeature, deleteHomeFeature } from '../src/services/homeService';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          data: mockFeatures,
          error: null,
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: mockFeatures[0],
            error: null,
          })),
        })),
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: { ...mockFeatures[0], title: 'Updated Title' },
              error: null,
            })),
          })),
        })),
      })),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: null,
        })),
      })),
    })),
  })),
}));

const mockFeatures = [
  {
    id: '1',
    title: 'Test Feature',
    subtitle: 'Test Subtitle',
    icon: 'Package',
    order: 1,
    created_at: '2025-01-29T00:00:00Z',
    updated_at: '2025-01-29T00:00:00Z',
  },
  {
    id: '2',
    title: 'Another Feature',
    subtitle: 'Another Subtitle',
    icon: 'Code',
    order: 2,
    created_at: '2025-01-29T00:00:00Z',
    updated_at: '2025-01-29T00:00:00Z',
  },
];

// Mock environment variables
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';

describe('homeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHomeFeatures', () => {
    it('should fetch home features successfully', async () => {
      const features = await getHomeFeatures();
      
      expect(features).toEqual(mockFeatures);
      expect(features).toHaveLength(2);
      expect(features[0].title).toBe('Test Feature');
    });

    it('should handle empty results', async () => {
      // Mock empty response
      const { createClient } = require('@supabase/supabase-js');
      const mockClient = createClient();
      mockClient.from().select().order.mockReturnValueOnce({
        data: [],
        error: null,
      });

      const features = await getHomeFeatures();
      expect(features).toEqual([]);
    });

    it('should throw error when Supabase returns error', async () => {
      // Mock error response
      const { createClient } = require('@supabase/supabase-js');
      const mockClient = createClient();
      mockClient.from().select().order.mockReturnValueOnce({
        data: null,
        error: { message: 'Database error' },
      });

      await expect(getHomeFeatures()).rejects.toThrow('Failed to fetch home features: Database error');
    });
  });

  describe('createHomeFeature', () => {
    it('should create a new home feature successfully', async () => {
      const newFeature = {
        title: 'New Feature',
        subtitle: 'New Subtitle',
        icon: 'Star',
        order: 3,
      };

      const result = await createHomeFeature(newFeature);
      
      expect(result).toEqual(mockFeatures[0]);
    });

    it('should throw error when creation fails', async () => {
      const { createClient } = require('@supabase/supabase-js');
      const mockClient = createClient();
      mockClient.from().insert().select().single.mockReturnValueOnce({
        data: null,
        error: { message: 'Creation failed' },
      });

      const newFeature = {
        title: 'New Feature',
        subtitle: 'New Subtitle',
        icon: 'Star',
        order: 3,
      };

      await expect(createHomeFeature(newFeature)).rejects.toThrow('Failed to create home feature: Creation failed');
    });
  });

  describe('updateHomeFeature', () => {
    it('should update a home feature successfully', async () => {
      const updates = { title: 'Updated Title' };
      
      const result = await updateHomeFeature('1', updates);
      
      expect(result.title).toBe('Updated Title');
    });

    it('should throw error when update fails', async () => {
      const { createClient } = require('@supabase/supabase-js');
      const mockClient = createClient();
      mockClient.from().update().eq().select().single.mockReturnValueOnce({
        data: null,
        error: { message: 'Update failed' },
      });

      await expect(updateHomeFeature('1', { title: 'Updated' })).rejects.toThrow('Failed to update home feature: Update failed');
    });
  });

  describe('deleteHomeFeature', () => {
    it('should delete a home feature successfully', async () => {
      await expect(deleteHomeFeature('1')).resolves.not.toThrow();
    });

    it('should throw error when deletion fails', async () => {
      const { createClient } = require('@supabase/supabase-js');
      const mockClient = createClient();
      mockClient.from().delete().eq.mockReturnValueOnce({
        error: { message: 'Deletion failed' },
      });

      await expect(deleteHomeFeature('1')).rejects.toThrow('Failed to delete home feature: Deletion failed');
    });
  });
});