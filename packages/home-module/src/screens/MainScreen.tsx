import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RefreshCw } from 'lucide-react-native';
import { getHomeFeatures, HomeFeature } from '../services/homeService';
import { verifySupabaseConnection } from '../utils/supabase';
import { FeatureCard } from '../components/FeatureCard';

export default function MainScreen() {
  const [features, setFeatures] = useState<HomeFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionVerified, setConnectionVerified] = useState(false);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      setError(null);

      // Verify Supabase connection first
      if (!connectionVerified) {
        const isConnected = await verifySupabaseConnection();
        setConnectionVerified(isConnected);
        
        if (!isConnected) {
          throw new Error('Unable to connect to Supabase. Please check your configuration.');
        }
      }

      const data = await getHomeFeatures();
      setFeatures(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load features';
      setError(errorMessage);
      console.error('Error loading features:', err);
      
      // Show user-friendly alert
      Alert.alert(
        'Connection Error',
        'Unable to load features. Please check your internet connection and try again.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', onPress: loadFeatures }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.loadingText}>Loading features...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFeatures}>
            <RefreshCw size={20} color="#007AFF" />
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (features.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No features available</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFeatures}>
            <RefreshCw size={20} color="#007AFF" />
            <Text style={styles.retryText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.featuresContainer}>
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>JETGOLD</Text>
        <Text style={styles.subtitle}>Home Module</Text>
        {connectionVerified && (
          <View style={styles.connectionStatus}>
            <View style={styles.connectionDot} />
            <Text style={styles.connectionText}>Connected to Supabase</Text>
          </View>
        )}
      </View>
      {renderContent()}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 8,
  },
  connectionText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  featuresContainer: {
    padding: 20,
    paddingTop: 0,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  retryText: {
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 8,
  },
});