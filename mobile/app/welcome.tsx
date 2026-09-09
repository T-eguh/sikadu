import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../components/SafeScreen';
import { AppButton } from '../components/UI';
import { Colors, Shadows } from '../theme';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.replace('/login');
  };

  return (
    <SafeScreen backgroundColor="#FFFFFF">
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Branding Pill */}
        <View style={styles.topBadge}>
          <Text style={styles.topBadgeText}>PKBM BINA INSANI</Text>
        </View>

        {/* Modern Clean Education Illustration / Graphic */}
        <View style={styles.illustrationCard}>
          <View style={styles.illustrationCircle}>
            <Ionicons name="school" size={72} color="#1E3A8A" />
          </View>
          <View style={styles.decorPill1}>
            <Ionicons name="sparkles" size={16} color="#059669" />
            <Text style={styles.decorText1}>Digital LMS</Text>
          </View>
          <View style={styles.decorPill2}>
            <Ionicons name="shield-checkmark" size={16} color="#0284C7" />
            <Text style={styles.decorText2}>Android First</Text>
          </View>
        </View>

        {/* Typography & Identity */}
        <View style={styles.content}>
          <Text style={styles.brandTitle}>BISA</Text>
          <Text style={styles.brandSubtitle}>Bisa Insani Smart Academy</Text>

          <Text style={styles.brandDescription}>
            Platform Pembelajaran Digital PKBM Bina Insani
          </Text>

          <View style={styles.taglineBox}>
            <Text style={styles.taglineText}>
              "Belajar, Berkembang, dan Berkarya Bersama."
            </Text>
          </View>

          {/* Official Motto */}
          <View style={styles.mottoRow}>
            <View style={styles.mottoChip}>
              <Text style={styles.mottoText}>HEBAT</Text>
            </View>
            <Text style={styles.mottoDot}>•</Text>
            <View style={styles.mottoChip}>
              <Text style={styles.mottoText}>MANDIRI</Text>
            </View>
            <Text style={styles.mottoDot}>•</Text>
            <View style={styles.mottoChip}>
              <Text style={styles.mottoText}>KREATIF</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <AppButton
            title="Mulai Sekarang"
            onPress={handleStart}
            size="lg"
            icon="arrow-forward"
            iconPosition="right"
            style={styles.startButton}
          />
          <Text style={styles.versionNote}>Platform BISA v4.5 • PKBM Bina Insani</Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  topBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginTop: 8,
  },
  topBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E3A8A',
    letterSpacing: 1,
  },
  illustrationCard: {
    width: '100%',
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 16,
  },
  illustrationCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#F0F7FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#DBEAFE',
    ...Shadows.soft,
  },
  decorPill1: {
    position: 'absolute',
    top: 24,
    right: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    ...Shadows.soft,
  },
  decorText1: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  decorPill2: {
    position: 'absolute',
    bottom: 24,
    left: 28,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    ...Shadows.soft,
  },
  decorText2: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 3,
  },
  brandSubtitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E3A8A',
    marginTop: 2,
  },
  brandDescription: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },
  taglineBox: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  taglineText: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#334155',
    fontWeight: '600',
    textAlign: 'center',
  },
  mottoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 18,
  },
  mottoChip: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  mottoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 1,
  },
  mottoDot: {
    color: '#CBD5E1',
    fontWeight: '800',
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  startButton: {
    width: '100%',
  },
  versionNote: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 12,
  },
});
