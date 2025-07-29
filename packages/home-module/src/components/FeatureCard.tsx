import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { 
  Package, 
  Code, 
  Smartphone, 
  Navigation,
  Settings,
  Star,
  Shield,
  Zap
} from 'lucide-react-native';
import { HomeFeature } from '../services/homeService';

interface FeatureCardProps {
  feature: HomeFeature;
}

// Icon mapping for feature icons
const iconMap: Record<string, React.ComponentType<any>> = {
  Package,
  Code,
  Smartphone,
  Navigation,
  Settings,
  Star,
  Shield,
  Zap,
};

export function FeatureCard({ feature }: FeatureCardProps) {
  const IconComponent = feature.icon ? iconMap[feature.icon] : Package;

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        {IconComponent && (
          <IconComponent size={24} color="#007AFF" />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{feature.title}</Text>
        {feature.subtitle && (
          <Text style={styles.subtitle}>{feature.subtitle}</Text>
        )}
      </View>
    </View>
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
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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