import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
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

describe('MainScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading indicator initially', async () => {
    mockGetHomeFeatures.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    const { getByTestId } = render(<MainScreen />);
    
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('displays features when loaded successfully', async () => {
    const mockFeatures = [
      {
        id: '1',
        title: 'Feature 1',
        subtitle: 'Subtitle 1',
        icon: 'Package',
        order: 1,
      },
      {
        id: '2',
        title: 'Feature 2',
        subtitle: 'Subtitle 2',
        icon: 'Code',
        order: 2,
      },
    ];

    mockGetHomeFeatures.mockResolvedValue(mockFeatures);
    
    const { getByTestId, getByText } = render(<MainScreen />);
    
    await waitFor(() => {
      expect(getByTestId('features-list')).toBeTruthy();
      expect(getByText('Feature 1')).toBeTruthy();
      expect(getByText('Feature 2')).toBeTruthy();
    });
  });

  it('displays error state when fetch fails', async () => {
    const errorMessage = 'Network error';
    mockGetHomeFeatures.mockRejectedValue(new Error(errorMessage));
    
    const { getByTestId, getByText } = render(<MainScreen />);
    
    await waitFor(() => {
      expect(getByTestId('error-container')).toBeTruthy();
      expect(getByText('Something went wrong')).toBeTruthy();
      expect(getByText(errorMessage)).toBeTruthy();
    });
  });

  it('displays empty state when no features are returned', async () => {
    mockGetHomeFeatures.mockResolvedValue([]);
    
    const { getByTestId, getByText } = render(<MainScreen />);
    
    await waitFor(() => {
      expect(getByTestId('empty-state')).toBeTruthy();
      expect(getByText('No features available')).toBeTruthy();
    });
  });

  it('retries loading when retry button is pressed', async () => {
    mockGetHomeFeatures.mockRejectedValueOnce(new Error('Network error'));
    mockGetHomeFeatures.mockResolvedValueOnce([
      {
        id: '1',
        title: 'Feature 1',
        subtitle: 'Subtitle 1',
        icon: 'Package',
        order: 1,
      },
    ]);
    
    const { getByTestId, getByText } = render(<MainScreen />);
    
    // Wait for error state
    await waitFor(() => {
      expect(getByTestId('error-container')).toBeTruthy();
    });
    
    // Press retry button
    const retryButton = getByTestId('retry-button');
    fireEvent.press(retryButton);
    
    // Wait for successful load
    await waitFor(() => {
      expect(getByTestId('features-list')).toBeTruthy();
      expect(getByText('Feature 1')).toBeTruthy();
    });
    
    expect(mockGetHomeFeatures).toHaveBeenCalledTimes(2);
  });

  it('refreshes when refresh button is pressed in empty state', async () => {
    mockGetHomeFeatures.mockResolvedValueOnce([]);
    mockGetHomeFeatures.mockResolvedValueOnce([
      {
        id: '1',
        title: 'Feature 1',
        subtitle: 'Subtitle 1',
        icon: 'Package',
        order: 1,
      },
    ]);
    
    const { getByTestId, getByText } = render(<MainScreen />);
    
    // Wait for empty state
    await waitFor(() => {
      expect(getByTestId('empty-state')).toBeTruthy();
    });
    
    // Press refresh button
    const refreshButton = getByTestId('refresh-button');
    fireEvent.press(refreshButton);
    
    // Wait for successful load
    await waitFor(() => {
      expect(getByTestId('features-list')).toBeTruthy();
      expect(getByText('Feature 1')).toBeTruthy();
    });
    
    expect(mockGetHomeFeatures).toHaveBeenCalledTimes(2);
  });

  it('shows alert when feature card is pressed', async () => {
    const mockFeatures = [
      {
        id: '1',
        title: 'Feature 1',
        subtitle: 'Subtitle 1',
        icon: 'Package',
        order: 1,
      },
    ];

    mockGetHomeFeatures.mockResolvedValue(mockFeatures);
    
    const { getByTestId } = render(<MainScreen />);
    
    await waitFor(() => {
      expect(getByTestId('features-list')).toBeTruthy();
    });
    
    // Press the feature card
    const featureCard = getByTestId('feature-card');
    fireEvent.press(featureCard);
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Feature 1',
      'Subtitle 1',
      [{ text: 'OK' }]
    );
  });
});