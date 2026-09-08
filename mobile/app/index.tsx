import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../components/SafeScreen';
import { Logo } from '../components/Logo';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../constants/colors';
import { getRoleDashboardPath } from '../utils/formatters';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    // Show splash screen for at least 1.5 seconds for professional branding feel
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated && user) {
          const target = getRoleDashboardPath(user.role);
          router.replace(target as any);
        } else {
          router.replace('/login');
        }
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <SafeScreen backgroundColor={Colors.primary} statusBarStyle="light">
      <View style={styles.container}>
        <View style={styles.content}>
          <Logo size="lg" variant="light" />
        </View>

        <View style={styles.footer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Memuat sistem...</Text>
          <Text style={styles.versionText}>Versi 1.0.0 (Tahap 1)</Text>
        </View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '500',
    opacity: 0.9,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 6,
  },
});
