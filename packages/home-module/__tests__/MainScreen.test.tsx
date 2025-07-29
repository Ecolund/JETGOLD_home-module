import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MainScreen from '../src/screens/MainScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  setParams: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  canGoBack: jest.fn(() => false),
  isFocused: jest.fn(() => true),
  push: jest.fn(),
  replace: jest.fn(),
  pop: jest.fn(),
  popToTop: jest.fn(),
  setOptions: jest.fn(),
  reset: jest.fn(),
  getParent: jest.fn(),
  getState: jest.fn(),
  getId: jest.fn(),
};

describe('MainScreen', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MainScreen navigation={mockNavigation as any} />);
    
    expect(getByText('Welcome to Home Module')).toBeTruthy();
    expect(getByText('This is the main screen of the Home module')).toBeTruthy();
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('shows module info', () => {
    const { getByText } = render(<MainScreen navigation={mockNavigation as any} />);
    
    expect(getByText('Module Info')).toBeTruthy();
    expect(getByText('• Modular React Native architecture')).toBeTruthy();
    expect(getByText('• TypeScript support')).toBeTruthy();
    expect(getByText('• Navigation ready')).toBeTruthy();
    expect(getByText('• Testing configured')).toBeTruthy();
  });

  it('handles button press', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const { getByText } = render(<MainScreen navigation={mockNavigation as any} />);
    
    const button = getByText('Get Started');
    fireEvent.press(button);
    
    expect(consoleSpy).toHaveBeenCalledWith('Button pressed!');
    consoleSpy.mockRestore();
  });
});