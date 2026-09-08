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

export default function StudentDashboard() {
  useProtectedRoute(['STUDENT']);
  const { user } = useAuth();
  const router = useRouter();

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header subtitle="Siswa" />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Welcome Message Card */}
        <View style={styles.welcomeBanner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="sparkles" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.bannerText}>
            <Text style={styles.welcomeTitle}>Semangat Belajar,</Text>
            <Text style={styles.studentName}>{user?.name || 'Siswa'}</Text>
            <Text style={styles.welcomeSubtitle}>
              Platform Pembelajaran Digital Sekolah Model
            </Text>
          </View>
        </View>

        {/* Informasi Akun & Status Akun */}
        <Text style={styles.sectionTitle}>Informasi & Status Akun Siswa</Text>
        <Card style={styles.accountCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoCol}>
              <Text style={styles.infoLabel}>Nomor Induk Siswa (NIS)</Text>
              <Text style={styles.infoValue}>
                {user?.student?.studentNumber || '24001'}
              </Text>
            </View>
            <View style={styles.badgeSuccess}>
              <View style={styles.activeDot} />
              <Text style={styles.badgeSuccessText}>Aktif Terdaftar</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.idRow}>
            <View style={styles.idItem}>
              <Text style={styles.idLabel}>NISN</Text>
              <Text style={styles.idValue}>{user?.student?.nisn || '0071234561'}</Text>
            </View>
            <View style={styles.idItem}>
              <Text style={styles.idLabel}>Status Kelas</Text>
              <Text style={styles.idValue}>Kelas X - Semester 1</Text>
            </View>
          </View>
        </Card>

        {/* Menu Cepat Siswa */}
        <Text style={styles.sectionTitle}>Menu Cepat Siswa</Text>
        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push('/siswa/modul' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#D1FAE5' }]}>
              <Ionicons name="book" size={24} color={Colors.accent} />
            </View>
            <Text style={styles.menuTitle}>Modul Saya</Text>
            <Text style={styles.menuDesc}>Akses materi digital</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push('/siswa/tugas' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="checkbox" size={24} color={Colors.warning} />
            </View>
            <Text style={styles.menuTitle}>Daftar Tugas</Text>
            <Text style={styles.menuDesc}>Tenggat & latihan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuCard}
            onPress={() => router.push('/siswa/profile' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.menuIconBox, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="person" size={24} color={Colors.secondary} />
            </View>
            <Text style={styles.menuTitle}>Profil Siswa</Text>
            <Text style={styles.menuDesc}>Data NISN & akun</Text>
          </TouchableOpacity>

          <View style={[styles.menuCard, styles.menuCardDisabled]}>
            <View style={[styles.menuIconBox, { backgroundColor: '#F1F5F9' }]}>
              <Ionicons name="medal-outline" size={24} color={Colors.textMuted} />
            </View>
            <Text style={[styles.menuTitle, { color: Colors.textMuted }]}>Nilai & Rapor</Text>
            <Text style={styles.menuDesc}>Tersedia pada Tahap 2</Text>
          </View>
        </View>

        {/* Phase 1 Notice */}
        <Card style={styles.phaseNotice}>
          <View style={styles.phaseRow}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.accent} />
            <View style={styles.phaseTextContainer}>
              <Text style={styles.phaseTitle}>Akun Terotentikasi & Aman</Text>
              <Text style={styles.phaseBody}>
                Anda masuk sebagai Siswa. Sesi disimpan di SecureStore ponsel Anda. Rute Guru dan Admin diproteksi secara otomatis.
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
    backgroundColor: Colors.accent,
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
  studentName: {
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
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  idItem: {
    flex: 1,
  },
  idLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  idValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
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
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
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
    color: Colors.accent,
  },
  phaseBody: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
});
