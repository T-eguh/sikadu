import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../components/SafeScreen';
import { AppHeader, AppButton, AppInput, StatusBadge } from '../../components/UI';
import { Card } from '../../components/Card';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { useAuth } from '../../hooks/useAuth';
import { Colors, Shadows } from '../../theme';
import { AcademicService } from '../../services/academicService';
import { authService } from '../../services/authService';
import { StudentMyClassItem } from '../../types/academic';

export default function StudentKelasScreen() {
  useProtectedRoute(['STUDENT']);
  const router = useRouter();
  const { user } = useAuth();

  const [myClass, setMyClass] = useState<StudentMyClassItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Invitation Code State
  const [invitationCode, setInvitationCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
  const [showJoinSection, setShowJoinSection] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await AcademicService.getStudentMyClass();
      setMyClass(res);
      setJoinError(null);
    } catch (e: any) {
      setMyClass(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleJoinClass = async () => {
    const cleanCode = invitationCode.trim().toUpperCase();
    if (!cleanCode) {
      setJoinError('Silakan masukkan Kode Kelas BISA.');
      return;
    }

    setJoinError(null);
    setJoinSuccess(null);
    setIsJoining(true);

    try {
      const res = await authService.joinClass(cleanCode);
      setJoinSuccess(res.message || 'Berhasil bergabung ke kelas!');
      setInvitationCode('');
      await loadData();

      // Show success alert and navigate to dashboard
      setTimeout(() => {
        router.replace('/siswa/dashboard' as any);
      }, 1200);
    } catch (err: any) {
      setJoinError(
        err.response?.data?.message ||
          err.message ||
          'Kode kelas tidak valid, telah kadaluarsa, atau kuota habis.'
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <SafeScreen backgroundColor="#F8FAFC">
      <AppHeader
        title="Kelas Saya"
        subtitle="Rombongan Belajar & Kode Kelas BISA"
      />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#1E3A8A" />
          <Text style={styles.loadingText}>Memuat informasi kelas...</Text>
        </View>
      ) : !myClass ? (
        /* ========================================================
           LAYAR LENGKAPI PENDAFTARAN (BAGIAN 10 & 11)
           Tampil jika Siswa belum terdaftar di kelas (Status: PENDING)
           ======================================================== */
        <FlatList
          data={[]}
          renderItem={() => null}
          contentContainerStyle={styles.registrationContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E3A8A']} />
          }
          ListHeaderComponent={
            <View style={styles.registrationCard}>
              {/* Header Status Pendaftaran */}
              <View style={styles.regHeader}>
                <View style={styles.avatarContainer}>
                  {user?.avatar ? (
                    <Image source={{ uri: user.avatar }} style={styles.googleAvatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Ionicons name="person" size={36} color="#1E3A8A" />
                    </View>
                  )}
                  <View style={styles.googleBadge}>
                    <Ionicons name="logo-google" size={12} color="#EA4335" />
                  </View>
                </View>

                <Text style={styles.studentName}>{user?.name || 'Siswa BISA'}</Text>
                <Text style={styles.studentEmail}>{user?.email || '-'}</Text>

                <View style={styles.statusPill}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Menunggu Kode Kelas</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Form Input Kode Kelas */}
              <View style={styles.inputSection}>
                <Text style={styles.formTitle}>Lengkapi Pendaftaran</Text>
                <Text style={styles.formSubtitle}>
                  Masukkan Kode Kelas yang diberikan oleh Guru atau Admin PKBM Bina Insani untuk
                  mengaktifkan akun dan mengakses materi belajar.
                </Text>

                {joinError && (
                  <View style={styles.errorBanner}>
                    <Ionicons name="alert-circle" size={18} color="#DC2626" style={{ marginRight: 6 }} />
                    <Text style={styles.errorText}>{joinError}</Text>
                  </View>
                )}

                {joinSuccess && (
                  <View style={styles.successBanner}>
                    <Ionicons name="checkmark-circle" size={18} color="#059669" style={{ marginRight: 6 }} />
                    <Text style={styles.successText}>{joinSuccess}</Text>
                  </View>
                )}

                <AppInput
                  label="Kode Kelas BISA"
                  placeholder="Contoh: BISA-X-2026"
                  value={invitationCode}
                  onChangeText={(val) => {
                    setInvitationCode(val.toUpperCase());
                    setJoinError(null);
                  }}
                  icon="key-outline"
                  autoCapitalize="characters"
                  hint="Kode kombinasi huruf kapital dan angka dari PKBM Bina Insani"
                />

                <AppButton
                  title="Gabung Kelas Sekarang"
                  onPress={handleJoinClass}
                  loading={isJoining}
                  disabled={!invitationCode.trim() || isJoining}
                  icon="enter-outline"
                  iconPosition="right"
                  size="lg"
                  style={styles.joinButton}
                />
              </View>

              {/* BISA Identity Footer */}
              <View style={styles.cardFooter}>
                <Ionicons name="shield-checkmark" size={16} color="#059669" />
                <Text style={styles.footerText}>
                  PKBM Bina Insani • Hebat • Mandiri • Kreatif
                </Text>
              </View>
            </View>
          }
        />
      ) : (
        /* ========================================================
           LAYAR KELAS AKTIF SISWA (STATUS: ACTIVE)
           ======================================================== */
        <FlatList
          data={myClass.classmates || []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E3A8A']} />
          }
          ListHeaderComponent={
            <View>
              {/* Banner Rombongan Belajar */}
              <View style={styles.classBannerCard}>
                <View style={styles.bannerRow}>
                  <View style={styles.classIconBox}>
                    <Ionicons name="school" size={28} color="#FFFFFF" />
                  </View>
                  <View style={styles.bannerInfo}>
                    <View style={styles.activeTag}>
                      <Text style={styles.activeTagText}>KELAS AKTIF BISA</Text>
                    </View>
                    <Text style={styles.bannerClassName}>Kelas {myClass.name}</Text>
                    <Text style={styles.bannerGrade}>
                      Tingkat {myClass.grade} • Tahun Ajaran {myClass.academicYear?.name || '2026/2027'}
                    </Text>
                  </View>
                </View>

                {/* Wali Kelas */}
                <View style={styles.waliBox}>
                  <Ionicons name="person-circle-outline" size={22} color="#1E3A8A" />
                  <View style={styles.waliTexts}>
                    <Text style={styles.waliLabel}>Wali Kelas:</Text>
                    <Text style={styles.waliName}>
                      {myClass.homeroomTeacher ? myClass.homeroomTeacher.name : 'Belum Ditentukan'}
                    </Text>
                  </View>
                </View>

                {/* Tombol Input Kode Kelas Tambahan */}
                <TouchableOpacity
                  style={styles.switchCodeToggle}
                  onPress={() => setShowJoinSection(!showJoinSection)}
                >
                  <Ionicons name="key-outline" size={14} color="#0284C7" />
                  <Text style={styles.switchCodeText}>
                    {showJoinSection ? 'Tutup Pindah Kelas' : 'Pindah atau Masukkan Kode Kelas Baru'}
                  </Text>
                </TouchableOpacity>

                {/* Section Input Kode Kelas Tambahan jika dibuka */}
                {showJoinSection && (
                  <View style={styles.secondaryJoinBox}>
                    <Text style={styles.secondaryJoinTitle}>Masukkan Kode Kelas Lain:</Text>
                    <AppInput
                      placeholder="Kode Kelas Baru"
                      value={invitationCode}
                      onChangeText={(val) => setInvitationCode(val.toUpperCase())}
                      autoCapitalize="characters"
                    />
                    {joinError && <Text style={styles.errorTextMini}>{joinError}</Text>}
                    <AppButton
                      title="Ganti ke Kelas Ini"
                      onPress={handleJoinClass}
                      loading={isJoining}
                      size="sm"
                      style={{ marginTop: 6 }}
                    />
                  </View>
                )}
              </View>

              {/* Mata Pelajaran Kelas */}
              {myClass.subjects && myClass.subjects.length > 0 && (
                <View style={styles.subjectsSection}>
                  <Text style={styles.sectionTitle}>
                    Mata Pelajaran Kelas ({myClass.subjects.length})
                  </Text>
                  <View style={styles.subjectsGrid}>
                    {myClass.subjects.map((sub) => (
                      <View key={sub.id} style={styles.subjectChip}>
                        <Ionicons name="book" size={16} color="#1E3A8A" />
                        <View style={styles.subjectChipInfo}>
                          <Text style={styles.subjectChipName}>{sub.subjectName}</Text>
                          <Text style={styles.subjectChipTeacher}>{sub.teacherName}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <Text style={styles.sectionTitle}>
                Daftar Teman Sekelas ({myClass.totalClassmates} Siswa)
              </Text>
            </View>
          }
          renderItem={({ item, index }) => (
            <View style={[styles.classmateCard, item.isMe && styles.myCard]}>
              <View style={styles.classmateRow}>
                <View style={[styles.numberCircle, item.isMe && styles.myNumberCircle]}>
                  <Text style={[styles.numberText, item.isMe && styles.myNumberText]}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.classmateInfo}>
                  <View style={styles.nameRow}>
                    <Text style={[styles.classmateName, item.isMe && styles.myName]}>
                      {item.name}
                    </Text>
                    {item.isMe && (
                      <View style={styles.meBadge}>
                        <Text style={styles.meBadgeText}>Saya</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.nisText}>
                    NIS: {item.studentNumber || '-'} • NISN: {item.nisn || '-'}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  registrationContainer: {
    padding: 16,
    paddingBottom: 40,
    justifyContent: 'center',
    flexGrow: 1,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  registrationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Shadows.medium,
  },
  regHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  googleAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  avatarPlaceholder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  studentEmail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D97706',
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 18,
  },
  inputSection: {
    width: '100%',
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  successText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
    flex: 1,
  },
  joinButton: {
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  footerText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  classBannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    ...Shadows.soft,
  },
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  bannerInfo: {
    flex: 1,
  },
  activeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  activeTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#065F46',
  },
  bannerClassName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  bannerGrade: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  waliBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginTop: 14,
  },
  waliTexts: {
    marginLeft: 8,
  },
  waliLabel: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  waliName: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  },
  switchCodeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 6,
  },
  switchCodeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  secondaryJoinBox: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  secondaryJoinTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0369A1',
    marginBottom: 8,
  },
  errorTextMini: {
    fontSize: 11,
    color: '#DC2626',
    marginBottom: 6,
  },
  subjectsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    width: '48%',
    ...Shadows.soft,
  },
  subjectChipInfo: {
    marginLeft: 8,
    flex: 1,
  },
  subjectChipName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  subjectChipTeacher: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  classmateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 8,
    ...Shadows.soft,
  },
  myCard: {
    borderColor: '#38BDF8',
    backgroundColor: '#F0F9FF',
  },
  classmateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  myNumberCircle: {
    backgroundColor: '#0284C7',
  },
  numberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  myNumberText: {
    color: '#FFFFFF',
  },
  classmateInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classmateName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  myName: {
    color: '#0369A1',
    fontWeight: '800',
  },
  meBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  meBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  nisText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
});
