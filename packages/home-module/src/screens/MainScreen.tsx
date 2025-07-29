import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getHomeFeatures, HomeFeature } from '../services/homeService';
import { FeatureCard } from '../components/FeatureCard';

export default function MainScreen() {
  const [features, setFeatures] = useState<HomeFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadHomeFeatures();
  }, []);

  const loadHomeFeatures = async () => {
    try {
      setLoading(true);
      setError(null);
      const featuresData = await getHomeFeatures();
      setFeatures(featuresData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load features';
      setError(errorMessage);
      console.error('Error loading home features:', err);
      
      // Show alert for user feedback
      Alert.alert(
        'Error Loading Features',
        errorMessage,
        [
          { text: 'Retry', onPress: loadHomeFeatures },
          { text: 'OK', style: 'cancel' }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading features...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.errorSubtext}>
            Please check your internet connection and try again.
          </Text>
        </View>
      );
    }

    if (features.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No features available</Text>
          <Text style={styles.emptySubtext}>
            Features will appear here once they are added to the database.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Features</Text>
        {features.map((feature) => (
          <FeatureCard key={feature.id} feature={feature} />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>JETGOLD</Text>
          <Text style={styles.subtitle}>Home Module</Text>
        </View>
        
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome</Text>
          <Text style={styles.welcomeDescription}>
            This is the main screen of the JETGOLD home module with dynamic 
            features loaded from Supabase database.
          </Text>
        </View>

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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  featuresContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});