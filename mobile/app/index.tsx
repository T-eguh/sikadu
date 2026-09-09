import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../components/SafeScreen';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../theme';
import { getRoleDashboardPath } from '../utils/formatters';

export default function SplashScreen() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  // Animation values for smooth sequential entry
  const [fadeLogo] = useState(new Animated.Value(0));
  const [scaleLogo] = useState(new Animated.Value(0.88));
  const [fadeBisa] = useState(new Animated.Value(0));
  const [fadeFull] = useState(new Animated.Value(0));
  const [fadeInstitution] = useState(new Animated.Value(0));
  const [fadeMotto] = useState(new Animated.Value(0));
  const [fadeFooter] = useState(new Animated.Value(0));

  useEffect(() => {
    // Start graceful sequential animations
    Animated.parallel([
      Animated.timing(fadeLogo, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scaleLogo, { toValue: 1, friction: 6, useNativeDriver: true }),
    ]).start(() => {
      Animated.timing(fadeBisa, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
        Animated.timing(fadeFull, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
          Animated.timing(fadeInstitution, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
            Animated.timing(fadeMotto, { toValue: 1, duration: 300, useNativeDriver: true }).start(() => {
              Animated.timing(fadeFooter, { toValue: 1, duration: 250, useNativeDriver: true }).start();
            });
          });
        });
      });
    });

    // Timeout duration 2.0s to allow users to absorb the official branding sequence
    const timer = setTimeout(() => {
      if (!isLoading) {
        if (isAuthenticated && user) {
          const target = getRoleDashboardPath(user.role);
          router.replace(target as any);
        } else {
          router.replace('/welcome' as any);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <SafeScreen backgroundColor="#0B1536" statusBarStyle="light">
      <View style={styles.container}>
        {/* Subtle decorative aura */}
        <View style={styles.ambientTop} />
        <View style={styles.ambientBottom} />

        <View style={{ height: 20 }} />

        {/* Central Official Branding Presentation */}
        <View style={styles.content}>
          {/* 1. Logo BISA */}
          <Animated.View
            style={[
              styles.logoBadge,
              {
                opacity: fadeLogo,
                transform: [{ scale: scaleLogo }],
              },
            ]}
          >
            <View style={styles.logoInner}>
              <Ionicons name="school" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.logoSparkle}>
              <Ionicons name="sparkles" size={14} color="#FBBF24" />
            </View>
          </Animated.View>

          {/* 2. BISA */}
          <Animated.Text style={[styles.brandBisa, { opacity: fadeBisa }]}>
            BISA
          </Animated.Text>

          {/* 3. Bisa Insani Smart Academy */}
          <Animated.Text style={[styles.brandFull, { opacity: fadeFull }]}>
            Bisa Insani Smart Academy
          </Animated.Text>

          {/* 4. PKBM Bina Insani */}
          <Animated.View style={[styles.institutionBadge, { opacity: fadeInstitution }]}>
            <Text style={styles.institutionText}>PKBM Bina Insani</Text>
          </Animated.View>

          {/* 5. Hebat • Mandiri • Kreatif */}
          <Animated.View style={[styles.mottoRow, { opacity: fadeMotto }]}>
            <Text style={styles.mottoWord}>HEBAT</Text>
            <Text style={styles.mottoDot}>•</Text>
            <Text style={styles.mottoWord}>MANDIRI</Text>
            <Text style={styles.mottoDot}>•</Text>
            <Text style={styles.mottoWord}>KREATIF</Text>
          </Animated.View>
        </View>

        {/* Loading Indicator & Platform Version */}
        <Animated.View style={[styles.footer, { opacity: fadeFooter }]}>
          <ActivityIndicator size="small" color="#38BDF8" />
          <Text style={styles.loadingText}>Memuat Platform BISA...</Text>
          <Text style={styles.versionText}>Versi 4.5 • Mobile Native Android</Text>
        </Animated.View>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    backgroundColor: '#0B1536',
    position: 'relative',
    overflow: 'hidden',
  },
  ambientTop: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  ambientBottom: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(16, 185, 129, 0.10)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoBadge: {
    position: 'relative',
    marginBottom: 16,
  },
  logoInner: {
    width: 90,
    height: 90,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSparkle: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0B1536',
  },
  brandBisa: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginTop: 4,
  },
  brandFull: {
    fontSize: 14,
    fontWeight: '700',
    color: '#BAE6FD',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  institutionBadge: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  institutionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E0F2FE',
  },
  mottoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
  },
  mottoWord: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FCD34D',
    letterSpacing: 1.5,
  },
  mottoDot: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#BAE6FD',
    fontSize: 12,
    marginTop: 10,
    fontWeight: '600',
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 11,
    marginTop: 4,
  },
});
