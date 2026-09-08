import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeScreen } from '../../components/SafeScreen';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useAuth } from '../../hooks/useAuth';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { Colors } from '../../constants/colors';

export default function TeacherDashboard() {
  useProtectedRoute(['TEACHER']);
  const { user } = useAuth();
  const router = useRouter();

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header subtitle="Guru Pengajar" />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Welcome Message Card */}
        <View style={styles.welcomeBanner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="school" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.welcomeTitle}>Selamat Datang,</Text>
            <Text style={styles.teacherName}>{user?.name || 'Bapak/Ibu Guru'}</Text>
            <Text style={styles.welcomeSubtitle}>
              LMS Pengajaran Digital Sekolah Model
            </Text>
          </View>
        </View>

        {/* Informasi Akun & Status Akun */}
        <Text style={styles.sectionTitle}>Informasi & Status Akun</Text>
        <Card style={styles.accountCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Nomor Induk Pegawai (NIP)</Text>
              <Text style={styles.infoValue}>
                {user?.teacher?.teacherNumber || '198501152010011001'}
              </Text>
            </View>
            <View style={styles.badgeSuccess}>
              <View style={styles.activeDot} />
              <Text style={styles.badgeSuccessText}>Akun Aktif</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailGrid}>
            <View style={styles.gridItem}>
              <Ionicons name="mail-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.gridText}>{user?.email}</Text>
            </View>
            <View style={styles.gridItem}>
              <Ionicons name="shield-checkmark-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.gridText}>Peran: GURU (TEACHER)</Text>
            </View>
          </View>
        </Card>

        {/* Menu Cepat Guru */}
        <Text style={styles.sectionTitle}>Menu Cepat Guru</Text>
        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push('/guru/kelas' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="bookmarks" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.menuTitle}>Jadwal Kelas</Text>
            <Text style={styles.menuDesc}>Daftar kelas yang diampu</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push('/guru/modul' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#EDE9FE' }]}>
              <Ionicons name="document-text" size={24} color="#7C3AED" />
            </View>
            <Text style={styles.menuTitle}>Materi & Modul</Text>
            <Text style={styles.menuDesc}>Bahan ajar digital</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push('/guru/profile' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="person" size={24} color={Colors.accent} />
            </View>
            <Text style={styles.menuTitle}>Profil Pengajar</Text>
            <Text style={styles.menuDesc}>Informasi data guru</Text>
          </TouchableOpacity>

          <View style={[styles.menuCard, styles.menuCardDisabled]}>
            <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="clipboard-outline" size={24} color={Colors.textMuted} />
            </View>
            <Text style={[styles.menuTitle, { color: Colors.textMuted }]}>Penilaian</Text>
            <Text style={styles.menuDesc}>Tersedia pada Tahap 2</Text>
          </View>
        </View>

        {/* Phase 1 Notice */}
        <Card style={styles.phaseNotice}>
          <View style={styles.phaseRow}>
            <Ionicons name="information-circle" size={20} color={Colors.secondary} />
            <View style={styles.phaseTextContainer}>
              <Text style={styles.phaseTitle}>Fondasi Tahap 1 Siap</Text>
              <Text style={styles.phaseBody}>
                Navigasi khusus guru, proteksi rute, dan token SecureStore telah aktif. Fitur pembuatan tugas dan kuis interaktif akan dibuka pada Tahap 2.
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    paddingBottom: 30,
  },
  welcomeBanner: {
    backgroundColor: Colors.secondary,
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bannerText: {
    flex: 1,
  },
  welcomeTitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
    fontWeight: '500',
  },
  teacherName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  welcomeSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
    marginTop: 6,
  },
  accountCard: {
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 6,
  },
  badgeSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  detailGrid: {
    gap: 8,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gridText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  menuCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuCardDisabled: {
    opacity: 0.7,
    backgroundColor: '#FAFAFA',
  },
  menuIconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  menuDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  phaseNotice: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  phaseRow: {
    flexDirection: 'row',
  },
  phaseTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  phaseTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  phaseBody: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
});
