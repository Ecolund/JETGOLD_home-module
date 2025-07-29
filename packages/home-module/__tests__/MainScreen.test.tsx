import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import MainScreen from '../src/screens/MainScreen';
import * as homeService from '../src/services/homeService';

// Mock the homeService
jest.mock('../src/services/homeService');
const mockGetHomeFeatures = homeService.getHomeFeatures as jest.MockedFunction<typeof homeService.getHomeFeatures>;

// Mock Alert
jest.spyOn(Alert, 'alert');

// Mock SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));

// Mock StatusBar
jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

const mockFeatures = [
  {
    id: '1',
    title: 'Test Feature 1',
    subtitle: 'Test Subtitle 1',
    icon: 'Package',
    order: 1,
    created_at: '2025-01-29T00:00:00Z',
    updated_at: '2025-01-29T00:00:00Z',
  },
  {
    id: '2',
    title: 'Test Feature 2',
    subtitle: 'Test Subtitle 2',
    icon: 'Code',
    order: 2,
    created_at: '2025-01-29T00:00:00Z',
    updated_at: '2025-01-29T00:00:00Z',
  },
];

describe('MainScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockGetHomeFeatures.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { getByText } = render(<MainScreen />);
    
    expect(getByText('Loading features...')).toBeTruthy();
    expect(getByText('JETGOLD')).toBeTruthy();
    expect(getByText('Home Module')).toBeTruthy();
  });

  it('should render features when loaded successfully', async () => {
    mockGetHomeFeatures.mockResolvedValue(mockFeatures);
    
    const { getByText, queryByText } = render(<MainScreen />);
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(queryByText('Loading features...')).toBeNull();
    });
    
    // Check that features are rendered
    expect(getByText('Test Feature 1')).toBeTruthy();
    expect(getByText('Test Subtitle 1')).toBeTruthy();
    expect(getByText('Test Feature 2')).toBeTruthy();
    expect(getByText('Test Subtitle 2')).toBeTruthy();
    expect(getByText('Features')).toBeTruthy();
  });

  it('should render empty state when no features are available', async () => {
    mockGetHomeFeatures.mockResolvedValue([]);
    
    const { getByText, queryByText } = render(<MainScreen />);
    
    await waitFor(() => {
      expect(queryByText('Loading features...')).toBeNull();
    });
    
    expect(getByText('No features available')).toBeTruthy();
    expect(getByText('Features will appear here once they are added to the database.')).toBeTruthy();
  });

  it('should render error state when loading fails', async () => {
    const errorMessage = 'Network error';
    mockGetHomeFeatures.mockRejectedValue(new Error(errorMessage));
    
    const { getByText, queryByText } = render(<MainScreen />);
    
    await waitFor(() => {
      expect(queryByText('Loading features...')).toBeNull();
    });
    
    expect(getByText(`Error: ${errorMessage}`)).toBeTruthy();
    expect(getByText('Please check your internet connection and try again.')).toBeTruthy();
  });

  it('should show alert when loading fails', async () => {
    const errorMessage = 'Network error';
    mockGetHomeFeatures.mockRejectedValue(new Error(errorMessage));
    
    render(<MainScreen />);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error Loading Features',
        errorMessage,
        expect.arrayContaining([
          expect.objectContaining({ text: 'Retry' }),
          expect.objectContaining({ text: 'OK', style: 'cancel' })
        ])
      );
    });
  });

  it('should retry loading when retry button is pressed in alert', async () => {
    const errorMessage = 'Network error';
    mockGetHomeFeatures
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce(mockFeatures);
    
    render(<MainScreen />);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
    
    // Simulate pressing retry button
    const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
    const retryButton = alertCall[2].find((button: any) => button.text === 'Retry');
    retryButton.onPress();
    
    // Should call getHomeFeatures again
    expect(mockGetHomeFeatures).toHaveBeenCalledTimes(2);
  });

  it('should render welcome card', () => {
    mockGetHomeFeatures.mockResolvedValue([]);
    
    const { getByText } = render(<MainScreen />);
    
    expect(getByText('Welcome')).toBeTruthy();
    expect(getByText(/This is the main screen of the JETGOLD home module/)).toBeTruthy();
  });
});