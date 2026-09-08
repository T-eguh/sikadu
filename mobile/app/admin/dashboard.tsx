import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../components/SafeScreen';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useAuth } from '../../hooks/useAuth';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { Colors } from '../../constants/colors';
import { AcademicService } from '../../services/academicService';
import { AdminDashboardStats } from '../../types/academic';

export default function AdminDashboard() {
  useProtectedRoute(['ADMIN']);
  const { user } = useAuth();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<AdminDashboardStats>({
    totalTeachers: 0,
    totalStudents: 0,
    totalUsers: 0,
    totalClasses: 0,
    totalSubjects: 0,
    totalTeachingAssignments: 0,
    activeAcademicYear: null,
    systemStatus: 'ONLINE',
    version: '3.0.0-phase3',
  });

  const fetchStats = async () => {
    try {
      const data = await AcademicService.getAdminStats();
      setStats(data);
    } catch (e) {
      // Keep existing stats if error occurs
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header subtitle="Administrator" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner Card */}
        <View style={styles.welcomeBanner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="shield-checkmark" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.welcomeTitle}>Selamat Datang,</Text>
            <Text style={styles.adminName}>{user?.name || 'Administrator'}</Text>
            <Text style={styles.welcomeSubtitle}>
              Panel Pengendalian Utama Sekolah Model LMS • Tahap 3
            </Text>
          </View>
        </View>

        {/* Academic Year Active Card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/admin/akademik/tahun-ajaran' as any)}
        >
          <Card style={styles.yearStatusCard}>
            <View style={styles.yearStatusRow}>
              <View style={styles.yearIconBox}>
                <Ionicons name="calendar" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.yearTexts}>
                <Text style={styles.yearLabel}>Tahun Ajaran Aktif</Text>
                <Text style={styles.yearName}>
                  {stats.activeAcademicYear ? stats.activeAcademicYear.name : 'Belum Ditentukan'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </View>
          </Card>
        </TouchableOpacity>

        {/* Core Statistics Cards (Dynamic from Database) */}
        <Text style={styles.sectionTitle}>Statistik Sekolah</Text>

        <View style={styles.statsGrid}>
          {/* Guru Card */}
          <TouchableOpacity
            style={styles.statCardWrapper}
            activeOpacity={0.8}
            onPress={() => router.push('/admin/guru' as any)}
          >
            <Card style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: Colors.roles.teacherLight }]}>
                <Ionicons name="people" size={22} color={Colors.roles.teacher} />
              </View>
              <Text style={styles.statNumber}>{stats.totalTeachers}</Text>
              <Text style={styles.statTitle}>Total Guru</Text>
            </Card>
          </TouchableOpacity>

          {/* Siswa Card */}
          <TouchableOpacity
            style={styles.statCardWrapper}
            activeOpacity={0.8}
            onPress={() => router.push('/admin/siswa' as any)}
          >
            <Card style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: Colors.roles.studentLight }]}>
                <Ionicons name="school" size={22} color={Colors.roles.student} />
              </View>
              <Text style={styles.statNumber}>{stats.totalStudents}</Text>
              <Text style={styles.statTitle}>Total Siswa</Text>
            </Card>
          </TouchableOpacity>

          {/* Kelas Card */}
          <TouchableOpacity
            style={styles.statCardWrapper}
            activeOpacity={0.8}
            onPress={() => router.push('/admin/akademik/kelas' as any)}
          >
            <Card style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="easel" size={22} color="#D97706" />
              </View>
              <Text style={styles.statNumber}>{stats.totalClasses}</Text>
              <Text style={styles.statTitle}>Kelas Aktif</Text>
            </Card>
          </TouchableOpacity>

          {/* Mapel Card */}
          <TouchableOpacity
            style={styles.statCardWrapper}
            activeOpacity={0.8}
            onPress={() => router.push('/admin/akademik/mata-pelajaran' as any)}
          >
            <Card style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="book" size={22} color="#059669" />
              </View>
              <Text style={styles.statNumber}>{stats.totalSubjects}</Text>
              <Text style={styles.statTitle}>Mata Pelajaran</Text>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Quick System Action Cards */}
        <Text style={styles.sectionTitle}>Modul Akademik</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/admin/akademik' as any)}
        >
          <Card style={styles.actionCard}>
            <View style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="library" size={20} color={Colors.primary} />
              </View>
              <View style={styles.actionDetails}>
                <Text style={styles.actionTitle}>Pusat Manajemen Akademik</Text>
                <Text style={styles.actionDesc}>Tahun ajaran, kurikulum mapel, kelas, dan penugasan mengajar</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </View>
          </Card>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Manajemen Pengguna</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/admin/guru' as any)}
        >
          <Card style={styles.actionCard}>
            <View style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="people" size={20} color={Colors.roles.admin} />
              </View>
              <View style={styles.actionDetails}>
                <Text style={styles.actionTitle}>Kelola Guru</Text>
                <Text style={styles.actionDesc}>Daftar pengajar, NIP, status aktif & reset password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/admin/siswa' as any)}
        >
          <Card style={styles.actionCard}>
            <View style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: '#DCFCE7' }]}>
                <Ionicons name="school" size={20} color={Colors.roles.student} />
              </View>
              <View style={styles.actionDetails}>
                <Text style={styles.actionTitle}>Kelola Siswa</Text>
                <Text style={styles.actionDesc}>Daftar peserta didik, NIS, NISN & reset password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </View>
          </Card>
        </TouchableOpacity>

        {/* Database & Security Notice */}
        <View style={styles.phaseInfo}>
          <Ionicons name="shield-checkmark" size={18} color={Colors.secondary} />
          <Text style={styles.phaseInfoText}>
            Tahap 3 Aktif: Manajemen Akademik (Tahun Ajaran, Mapel, Kelas, Penempatan Siswa, & Penugasan Mengajar) terintegrasi penuh ke PostgreSQL & Prisma ORM.
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
    paddingBottom: 30,
  },
  welcomeBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bannerText: {
    flex: 1,
  },
  welcomeTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
  adminName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  welcomeSubtitle: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
    marginTop: 4,
  },
  yearStatusCard: {
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  yearStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yearIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  yearTexts: {
    flex: 1,
  },
  yearLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  yearName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCardWrapper: {
    width: '48%',
  },
  statCard: {
    padding: 14,
    alignItems: 'center',
  },
  statIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  actionCard: {
    padding: 14,
    marginBottom: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  actionDetails: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  actionDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  phaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  phaseInfoText: {
    fontSize: 12,
    color: '#15803D',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});
