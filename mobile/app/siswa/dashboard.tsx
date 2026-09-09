import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../components/SafeScreen';
import { AppHeader, AppCard, AppButton, ProgressBar } from '../../components/UI';
import { useAuth } from '../../hooks/useAuth';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { Colors, Shadows } from '../../theme';
import { moduleService, ModuleItem } from '../../services/moduleService';
import { AcademicService } from '../../services/academicService';
import { StudentMyClassItem } from '../../types/academic';

export default function StudentDashboard() {
  useProtectedRoute(['STUDENT']);
  const { user } = useAuth();
  const router = useRouter();

  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [myClass, setMyClass] = useState<StudentMyClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    try {
      const [modulesRes, classRes] = await Promise.allSettled([
        moduleService.getStudentModules(),
        AcademicService.getStudentMyClass(),
      ]);

      if (modulesRes.status === 'fulfilled') {
        setModules(modulesRes.value || []);
      }
      if (classRes.status === 'fulfilled') {
        setMyClass(classRes.value || null);
      }
    } catch (e) {
      // Handled gracefully
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Find module for "Continue Learning"
  // Prioritize in-progress (percentage > 0 and < 100), otherwise first available module
  const continueModule =
    modules.find((m) => (m.percentage || 0) > 0 && (m.percentage || 0) < 100) ||
    modules[0] ||
    null;

  // Calculate statistics
  const totalModulesCount = modules.length;
  const completedCount = modules.filter((m) => (m.percentage || 0) === 100).length;
  const inProgressCount = modules.filter((m) => (m.percentage || 0) > 0 && (m.percentage || 0) < 100).length;
  const overallPercentage =
    totalModulesCount > 0
      ? Math.round(
          modules.reduce((acc, m) => acc + (m.percentage || 0), 0) / totalModulesCount
        )
      : 0;

  return (
    <SafeScreen backgroundColor="#F8FAFC">
      <AppHeader
        title="BISA Academy"
        subtitle="Platform Pembelajaran Digital PKBM Bina Insani"
        rightAction={{
          icon: 'person-circle-outline',
          onPress: () => router.push('/siswa/profile' as any),
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E3A8A']} />
        }
      >
        {/* Welcome & Student Profile Header Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeRow}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.studentAvatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={28} color="#1E3A8A" />
              </View>
            )}
            <View style={styles.welcomeTexts}>
              <View style={styles.greetingRow}>
                <Text style={styles.greetingPrefix}>Halo,</Text>
                <Text style={styles.studentName} numberOfLines={1}>
                  {user?.name || 'Siswa'} 👋
                </Text>
              </View>
              <Text style={styles.welcomeSubtitle}>
                Siap belajar dan berkembang hari ini?
              </Text>
              <View style={styles.badgeRow}>
                <View style={styles.classBadge}>
                  <Text style={styles.classBadgeText}>
                    {myClass ? `Kelas ${myClass.name}` : 'PKBM Bina Insani'}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusBadgeText}>Siswa Aktif</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Motivational Card */}
        <View style={styles.motivationBanner}>
          <View style={styles.motivationIconBox}>
            <Ionicons name="sparkles" size={20} color="#D97706" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.motivationQuote}>
              "Setiap langkah kecil adalah bagian dari perjalanan besar."
            </Text>
            <Text style={styles.motivationMotto}>Hebat • Mandiri • Kreatif</Text>
          </View>
        </View>

        {/* Progress Belajar Ringkasan */}
        <Text style={styles.sectionTitle}>PROGRESS BELAJAR</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="book" size={20} color="#1E3A8A" />
            </View>
            <Text style={styles.statNumber}>{totalModulesCount}</Text>
            <Text style={styles.statLabel}>Total Modul</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="time" size={20} color="#D97706" />
            </View>
            <Text style={styles.statNumber}>{inProgressCount}</Text>
            <Text style={styles.statLabel}>Diproses</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="checkmark-done" size={20} color="#059669" />
            </View>
            <Text style={styles.statNumber}>{completedCount}</Text>
            <Text style={styles.statLabel}>Selesai</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="trophy" size={20} color="#7C3AED" />
            </View>
            <Text style={styles.statNumber}>{overallPercentage}%</Text>
            <Text style={styles.statLabel}>Kelengkapan</Text>
          </View>
        </View>

        {/* CONTINUE LEARNING (LANJUTKAN BELAJAR) */}
        {continueModule ? (
          <View style={styles.continueSection}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>LANJUTKAN BELAJAR</Text>
              <TouchableOpacity onPress={() => router.push('/siswa/modul' as any)}>
                <Text style={styles.seeAllText}>Semua Modul →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.continueCard}>
              <View style={styles.continueTopRow}>
                {continueModule.thumbnailUrl ? (
                  <Image
                    source={{ uri: continueModule.thumbnailUrl }}
                    style={styles.continueThumbnail}
                  />
                ) : (
                  <View style={styles.continueThumbPlaceholder}>
                    <Ionicons name="library" size={28} color="#1E3A8A" />
                  </View>
                )}
                <View style={styles.continueDetails}>
                  <View style={styles.subjectPill}>
                    <Text style={styles.subjectPillText}>
                      {continueModule.subject?.name || 'Mata Pelajaran'}
                    </Text>
                  </View>
                  <Text style={styles.continueTitle} numberOfLines={2}>
                    {continueModule.title}
                  </Text>
                  <Text style={styles.continueTeacher}>
                    Guru: {continueModule.teacher?.user?.name || '-'}
                  </Text>
                </View>
              </View>

              {/* Progress bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>Progres Modul</Text>
                  <Text style={styles.progressValue}>
                    {continueModule.percentage || 0}%
                  </Text>
                </View>
                <ProgressBar
                  progress={continueModule.percentage || 0}
                  color="#1E3A8A"
                  height={8}
                />
              </View>

              <AppButton
                title="Lanjutkan Belajar"
                onPress={() => router.push(`/siswa/modul/${continueModule.id}` as any)}
                icon="play-circle-outline"
                iconPosition="right"
                size="md"
                style={styles.continueButton}
              />
            </View>
          </View>
        ) : null}

        {/* Quick Menu Navigation */}
        <Text style={styles.sectionTitle}>MENU PEMBELAJARAN</Text>
        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() => router.push('/siswa/modul' as any)}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="book-outline" size={24} color="#1E3A8A" />
            </View>
            <Text style={styles.menuItemTitle}>Modul Belajar</Text>
            <Text style={styles.menuItemSubtitle}>Materi interaktif</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() => router.push('/siswa/kelas' as any)}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#F0F9FF' }]}>
              <Ionicons name="people-outline" size={24} color="#0284C7" />
            </View>
            <Text style={styles.menuItemTitle}>Kelas & Rombel</Text>
            <Text style={styles.menuItemSubtitle}>Kode & teman sekelas</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() => router.push('/siswa/tugas' as any)}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="checkbox-outline" size={24} color="#D97706" />
            </View>
            <Text style={styles.menuItemTitle}>Tugas & Latihan</Text>
            <Text style={styles.menuItemSubtitle}>Tenggat & evaluasi</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() => router.push('/siswa/profile' as any)}
          >
            <View style={[styles.menuIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="person-outline" size={24} color="#059669" />
            </View>
            <Text style={styles.menuItemTitle}>Profil Siswa</Text>
            <Text style={styles.menuItemSubtitle}>NISN & info akun</Text>
          </TouchableOpacity>
        </View>

        {/* Modul Terbaru List */}
        {modules.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>MODUL TERBARU</Text>
            {modules.slice(0, 3).map((m) => (
              <TouchableOpacity
                key={m.id}
                style={styles.recentModuleCard}
                activeOpacity={0.8}
                onPress={() => router.push(`/siswa/modul/${m.id}` as any)}
              >
                <View style={styles.recentModuleIcon}>
                  <Ionicons name="document-text-outline" size={22} color="#1E3A8A" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.recentModuleTitle} numberOfLines={1}>
                    {m.title}
                  </Text>
                  <Text style={styles.recentModuleSubject}>
                    {m.subject?.name || 'Mata Pelajaran'} • {m.teacher?.user?.name || '-'}
                  </Text>
                  <View style={styles.recentModuleProgressRow}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <ProgressBar progress={m.percentage || 0} height={4} color="#059669" />
                    </View>
                    <Text style={styles.recentProgressText}>{m.percentage || 0}%</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
    ...Shadows.soft,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeTexts: {
    marginLeft: 14,
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  greetingPrefix: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 4,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    flexShrink: 1,
  },
  welcomeSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  classBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  classBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginRight: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  motivationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 16,
  },
  motivationIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  motivationQuote: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#92400E',
    fontWeight: '600',
    lineHeight: 16,
  },
  motivationMotto: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 1,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.soft,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 1,
  },
  continueSection: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  continueCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.soft,
  },
  continueTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  continueThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  continueThumbPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueDetails: {
    marginLeft: 12,
    flex: 1,
  },
  subjectPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  subjectPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  continueTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 18,
  },
  continueTeacher: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  progressContainer: {
    marginTop: 12,
    marginBottom: 12,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  progressValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  continueButton: {
    width: '100%',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.soft,
  },
  menuIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  menuItemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  menuItemSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  recentSection: {
    marginBottom: 8,
  },
  recentModuleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
    ...Shadows.soft,
  },
  recentModuleIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentModuleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  recentModuleSubject: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  recentModuleProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  recentProgressText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#059669',
  },
});
