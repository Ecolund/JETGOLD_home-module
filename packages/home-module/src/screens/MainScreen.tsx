import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RefreshCw, AlertCircle } from 'lucide-react-native';
import FeatureCard from '../components/FeatureCard';
import { getHomeFeatures } from '../services/homeService';
import { HomeFeature } from '../types';

export default function MainScreen() {
  const [features, setFeatures] = useState<HomeFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHomeFeatures();
      setFeatures(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load features';
      setError(errorMessage);
      console.error('Error loading features:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const handleRetry = () => {
    loadFeatures();
  };

  const handleFeaturePress = (feature: HomeFeature) => {
    Alert.alert(
      feature.title,
      feature.subtitle || 'Feature selected',
      [{ text: 'OK' }]
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer} testID="loading-indicator">
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading features...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer} testID="error-container">
          <AlertCircle size={48} color="#FF3B30" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={handleRetry} testID="retry-button">
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    if (features.length === 0) {
      return (
        <View style={styles.centerContainer} testID="empty-state">
          <Text style={styles.emptyTitle}>No features available</Text>
          <Text style={styles.emptyMessage}>
            Check back later for new features and updates.
          </Text>
          <Pressable style={styles.retryButton} onPress={handleRetry} testID="refresh-button">
            <RefreshCw size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Refresh</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.featuresContainer} testID="features-list">
        {features.map((feature) => (
          <FeatureCard
            key={feature.id}
            title={feature.title}
            subtitle={feature.subtitle}
            icon={feature.icon}
            onPress={() => handleFeaturePress(feature)}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>JETGOLD</Text>
        <Text style={styles.subtitle}>Home Module</Text>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  featuresContainer: {
    paddingTop: 8,
  },
});