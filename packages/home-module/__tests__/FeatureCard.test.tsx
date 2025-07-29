import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FeatureCard from '../src/components/FeatureCard';

describe('FeatureCard', () => {
  const mockProps = {
    title: 'Test Feature',
    subtitle: 'Test subtitle',
    icon: 'Package',
  };

  it('renders title correctly', () => {
    const { getByTestId } = render(<FeatureCard {...mockProps} />);
    
    const titleElement = getByTestId('feature-title');
    expect(titleElement.props.children).toBe('Test Feature');
  });

  it('renders subtitle when provided', () => {
    const { getByTestId } = render(<FeatureCard {...mockProps} />);
    
    const subtitleElement = getByTestId('feature-subtitle');
    expect(subtitleElement.props.children).toBe('Test subtitle');
  });

  it('does not render subtitle when not provided', () => {
    const { queryByTestId } = render(
      <FeatureCard title="Test Feature" icon="Package" />
    );
    
    const subtitleElement = queryByTestId('feature-subtitle');
    expect(subtitleElement).toBeNull();
  });

  it('calls onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <FeatureCard {...mockProps} onPress={mockOnPress} />
    );
    
    const card = getByTestId('feature-card');
    fireEvent.press(card);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders with default icon when icon prop is invalid', () => {
    const { getByTestId } = render(
      <FeatureCard title="Test Feature" icon="InvalidIcon" />
    );
    
    const card = getByTestId('feature-card');
    expect(card).toBeTruthy();
  });

  it('renders without icon prop', () => {
    const { getByTestId } = render(
      <FeatureCard title="Test Feature" subtitle="Test subtitle" />
    );
    
    const card = getByTestId('feature-card');
    expect(card).toBeTruthy();
  });
});