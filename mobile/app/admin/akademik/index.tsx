import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../components/SafeScreen';
import { Header } from '../../../components/Header';
import { Card } from '../../../components/Card';
import { useProtectedRoute } from '../../../hooks/useProtectedRoute';
import { Colors } from '../../../constants/colors';
import { AcademicService } from '../../../services/academicService';
import { AdminDashboardStats } from '../../../types/academic';

export default function AdminAkademikHub() {
  useProtectedRoute(['ADMIN']);
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);

  const loadStats = async () => {
    try {
      const data = await AcademicService.getAdminStats();
      setStats(data);
    } catch (e) {
      // ignore
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const modules = [
    {
      id: 'tahun-ajaran',
      title: 'Tahun Ajaran',
      subtitle: stats?.activeAcademicYear
        ? `Aktif: ${stats.activeAcademicYear.name}`
        : 'Kelola periode & status aktif',
      icon: 'calendar-outline',
      color: '#3B82F6',
      badge: stats?.activeAcademicYear ? 'Aktif' : 'Belum Ada',
      route: '/admin/akademik/tahun-ajaran',
    },
    {
      id: 'mata-pelajaran',
      title: 'Mata Pelajaran',
      subtitle: `${stats?.totalSubjects ?? 0} mapel terdaftar`,
      icon: 'book-outline',
      color: '#10B981',
      badge: `${stats?.totalSubjects ?? 0} Mapel`,
      route: '/admin/akademik/mata-pelajaran',
    },
    {
      id: 'kelas',
      title: 'Manajemen Kelas',
      subtitle: `${stats?.totalClasses ?? 0} kelas aktif`,
      icon: 'easel-outline',
      color: '#F59E0B',
      badge: `${stats?.totalClasses ?? 0} Kelas`,
      route: '/admin/akademik/kelas',
    },
    {
      id: 'penugasan',
      title: 'Penugasan Mengajar',
      subtitle: `${stats?.totalTeachingAssignments ?? 0} penugasan guru-mapel`,
      icon: 'git-branch-outline',
      color: '#8B5CF6',
      badge: `${stats?.totalTeachingAssignments ?? 0} Penugasan`,
      route: '/admin/akademik/penugasan',
    },
  ];

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header title="Manajemen Akademik" subtitle="Pusat Kurikulum & Pembelajaran" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Info Tahun Ajaran Aktif */}
        <Card style={styles.activeYearCard}>
          <View style={styles.bannerRow}>
            <View style={styles.bannerIconBox}>
              <Ionicons name="school" size={26} color="#FFFFFF" />
            </View>
            <View style={styles.bannerText}>
              <Text style={styles.bannerSubtitle}>Tahun Ajaran Aktif</Text>
              <Text style={styles.bannerTitle}>
                {stats?.activeAcademicYear ? stats.activeAcademicYear.name : 'Belum Diatur'}
              </Text>
              <Text style={styles.bannerNote}>
                Hanya 1 tahun ajaran yang boleh aktif pada satu periode sistem.
              </Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionHeader}>Modul Akademik</Text>

        <View style={styles.modulesGrid}>
          {modules.map((m) => (
            <TouchableOpacity
              key={m.id}
              style={styles.moduleCard}
              activeOpacity={0.8}
              onPress={() => router.push(m.route as any)}
            >
              <View style={[styles.moduleIconBox, { backgroundColor: `${m.color}15` }]}>
                <Ionicons name={m.icon as any} size={26} color={m.color} />
              </View>
              <View style={styles.moduleInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.moduleTitle}>{m.title}</Text>
                  <View style={[styles.badgePill, { backgroundColor: `${m.color}15` }]}>
                    <Text style={[styles.badgeText, { color: m.color }]}>{m.badge}</Text>
                  </View>
                </View>
                <Text style={styles.moduleSubtitle}>{m.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Informasi Aturan Tahap 3 */}
        <View style={styles.rulesCard}>
          <View style={styles.ruleTitleRow}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.rulesTitle}>Integritas Data Akademik</Text>
          </View>
          <Text style={styles.ruleText}>
            • Siswa hanya dapat terdaftar di 1 kelas aktif per tahun ajaran.{'\n'}
            • Mengaktifkan tahun ajaran baru otomatis menonaktifkan tahun ajaran sebelumnya.{'\n'}
            • Penugasan mengajar dijamin unik antar guru, kelas, dan mata pelajaran.
          </Text>
        </View>
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
  activeYearCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bannerText: {
    flex: 1,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  bannerNote: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 4,
    lineHeight: 15,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  modulesGrid: {
    gap: 12,
  },
  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 4,
  },
  moduleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  moduleInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  moduleTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  badgePill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  moduleSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  rulesCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginTop: 24,
  },
  ruleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rulesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginLeft: 6,
  },
  ruleText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
