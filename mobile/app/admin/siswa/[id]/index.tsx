import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../../components/SafeScreen';
import { Colors } from '../../../../constants/colors';
import { StudentService } from '../../../../services/studentService';
import { StudentItem } from '../../../../types/userManagement';
import { useProtectedRoute } from '../../../../hooks/useProtectedRoute';

export default function DetailSiswaScreen() {
  useProtectedRoute(['ADMIN']);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [student, setStudent] = useState<StudentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudent = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await StudentService.getStudentById(id);
      setStudent(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat detail siswa.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudent();
    }, [id])
  );

  const handleToggleStatus = () => {
    if (!student) return;
    const newStatus = !student.isActive;
    const actionLabel = newStatus ? 'mengaktifkan' : 'menonaktifkan';

    Alert.alert(
      `Konfirmasi Status Akun`,
      `Apakah Anda yakin ingin ${actionLabel} akun siswa "${student.name}"? ${
        !newStatus ? 'Siswa tidak akan bisa login ke aplikasi LMS.' : ''
      }`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: newStatus ? 'Aktifkan' : 'Nonaktifkan',
          style: newStatus ? 'default' : 'destructive',
          onPress: async () => {
            try {
              setIsUpdatingStatus(true);
              const updated = await StudentService.updateStatus(student.id, newStatus);
              setStudent(updated);
              Alert.alert('Sukses', `Akun siswa berhasil di${newStatus ? 'aktifkan' : 'nonaktifkan'}.`);
            } catch (err: any) {
              Alert.alert('Gagal', err.message || 'Gagal memperbarui status akun.');
            } finally {
              setIsUpdatingStatus(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <SafeScreen backgroundColor={Colors.background}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Siswa</Text>
        <View style={{ width: 36 }} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.roles.student} />
          <Text style={styles.loadingText}>Memuat informasi siswa...</Text>
        </View>
      ) : error || !student ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Siswa Tidak Ditemukan</Text>
          <Text style={styles.errorMessage}>{error || 'Data tidak tersedia.'}</Text>
          <TouchableOpacity style={styles.backHomeButton} onPress={() => router.back()}>
            <Text style={styles.backHomeButtonText}>Kembali ke Daftar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{student.name.charAt(0)}</Text>
            </View>
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentRole}>Siswa Peserta Didik</Text>

            <View
              style={[
                styles.statusPill,
                student.isActive ? styles.statusPillActive : styles.statusPillInactive,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: student.isActive ? Colors.success : Colors.error },
                ]}
              />
              <Text
                style={[
                  styles.statusPillText,
                  { color: student.isActive ? Colors.success : Colors.error },
                ]}
              >
                {student.isActive ? 'Akun Aktif' : 'Akun Dinonaktifkan'}
              </Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Data Pokok Siswa</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="finger-print-outline" size={18} color={Colors.roles.student} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Nomor Induk Siswa (NIS)</Text>
                <Text style={styles.infoValue}>{student.student?.studentNumber || '-'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="ribbon-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Nomor Induk Siswa Nasional (NISN)</Text>
                <Text style={styles.infoValue}>{student.student?.nisn || '-'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="mail-outline" size={18} color={Colors.secondary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email Akun LMS</Text>
                <Text style={styles.infoValue}>{student.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="calendar-outline" size={18} color={Colors.textSecondary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Terdaftar Pada</Text>
                <Text style={styles.infoValue}>{formatDate(student.createdAt)}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsSection}>
            <Text style={styles.sectionTitle}>Tindakan Akun</Text>

            {/* Edit Button */}
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={() => router.push(`/admin/siswa/${student.id}/edit` as any)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="create-outline" size={20} color={Colors.secondary} />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>Edit Data Siswa</Text>
                <Text style={styles.actionDesc}>Perbarui nama, email, NIS, atau NISN</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>

            {/* Reset Password Button */}
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={() => router.push(`/admin/siswa/${student.id}/reset-password` as any)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="key-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>Reset Password</Text>
                <Text style={styles.actionDesc}>Ubah kata sandi akun siswa ini</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>

            {/* Activate / Deactivate Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                student.isActive ? styles.deactivateButton : styles.activateButton,
              ]}
              activeOpacity={0.8}
              onPress={handleToggleStatus}
              disabled={isUpdatingStatus}
            >
              <View
                style={[
                  styles.actionIconBox,
                  {
                    backgroundColor: student.isActive ? '#FEE2E2' : '#DCFCE7',
                  },
                ]}
              >
                <Ionicons
                  name={student.isActive ? 'lock-closed-outline' : 'lock-open-outline'}
                  size={20}
                  color={student.isActive ? Colors.error : Colors.success}
                />
              </View>
              <View style={styles.actionTextBox}>
                <Text
                  style={[
                    styles.actionTitle,
                    { color: student.isActive ? Colors.error : Colors.success },
                  ]}
                >
                  {student.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun Kembali'}
                </Text>
                <Text style={styles.actionDesc}>
                  {student.isActive
                    ? 'Blokir akses masuk siswa ke aplikasi'
                    : 'Buka kembali akses masuk siswa'}
                </Text>
              </View>
              {isUpdatingStatus ? (
                <ActivityIndicator size="small" color={student.isActive ? Colors.error : Colors.success} />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={student.isActive ? Colors.error : Colors.success}
                />
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLargeText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.roles.student,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  studentRole: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  statusPillActive: {
    backgroundColor: Colors.successLight,
  },
  statusPillInactive: {
    backgroundColor: Colors.errorLight,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  actionsSection: {
    gap: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deactivateButton: {
    borderColor: '#FECDD3',
    backgroundColor: '#FFF1F2',
  },
  activateButton: {
    borderColor: '#BBF7D0',
    backgroundColor: '#F0FDF4',
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionTextBox: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  actionDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
  },
  errorMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  backHomeButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backHomeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
