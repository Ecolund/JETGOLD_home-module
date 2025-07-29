import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';

export interface FeatureCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  onPress?: () => void;
}

export default function FeatureCard({ title, subtitle, icon, onPress }: FeatureCardProps) {
  // Get the icon component from lucide-react-native
  const IconComponent = icon && (Icons as any)[icon] ? (Icons as any)[icon] as LucideIcon : Icons.Package;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]}
      onPress={onPress}
      testID="feature-card"
    >
      <View style={styles.iconContainer}>
        <IconComponent size={24} color="#007AFF" strokeWidth={2} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} testID="feature-title">
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.subtitle} testID="feature-subtitle">
            {subtitle}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});