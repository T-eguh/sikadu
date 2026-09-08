import React, { useState, useEffect, useCallback } from 'react';
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
import { TeacherService } from '../../../../services/teacherService';
import { TeacherItem } from '../../../../types/userManagement';
import { useProtectedRoute } from '../../../../hooks/useProtectedRoute';

export default function DetailGuruScreen() {
  useProtectedRoute(['ADMIN']);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [teacher, setTeacher] = useState<TeacherItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeacher = async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await TeacherService.getTeacherById(id);
      setTeacher(data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat detail guru.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTeacher();
    }, [id])
  );

  const handleToggleStatus = () => {
    if (!teacher) return;
    const newStatus = !teacher.isActive;
    const actionLabel = newStatus ? 'mengaktifkan' : 'menonaktifkan';

    Alert.alert(
      `Konfirmasi Status Akun`,
      `Apakah Anda yakin ingin ${actionLabel} akun guru "${teacher.name}"? ${
        !newStatus ? 'Guru tidak akan bisa login ke aplikasi.' : ''
      }`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: newStatus ? 'Aktifkan' : 'Nonaktifkan',
          style: newStatus ? 'default' : 'destructive',
          onPress: async () => {
            try {
              setIsUpdatingStatus(true);
              const updated = await TeacherService.updateStatus(teacher.id, newStatus);
              setTeacher(updated);
              Alert.alert('Sukses', `Akun guru berhasil di${newStatus ? 'aktifkan' : 'nonaktifkan'}.`);
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
        <Text style={styles.headerTitle}>Detail Guru</Text>
        <View style={{ width: 36 }} />
      </View>

      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat informasi guru...</Text>
        </View>
      ) : error || !teacher ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Guru Tidak Ditemukan</Text>
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
              <Text style={styles.avatarLargeText}>{teacher.name.charAt(0)}</Text>
            </View>
            <Text style={styles.teacherName}>{teacher.name}</Text>
            <Text style={styles.teacherRole}>Guru Pengajar</Text>

            <View
              style={[
                styles.statusPill,
                teacher.isActive ? styles.statusPillActive : styles.statusPillInactive,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: teacher.isActive ? Colors.success : Colors.error },
                ]}
              />
              <Text
                style={[
                  styles.statusPillText,
                  { color: teacher.isActive ? Colors.success : Colors.error },
                ]}
              >
                {teacher.isActive ? 'Akun Aktif' : 'Akun Dinonaktifkan'}
              </Text>
            </View>
          </View>

          {/* Details Section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informasi Profil</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="card-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Nomor Induk Guru (NIP)</Text>
                <Text style={styles.infoValue}>{teacher.teacher?.teacherNumber || '-'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="mail-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email Akun</Text>
                <Text style={styles.infoValue}>{teacher.email}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIconBox}>
                <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Terdaftar Sejak</Text>
                <Text style={styles.infoValue}>{formatDate(teacher.createdAt)}</Text>
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
              onPress={() => router.push(`/admin/guru/${teacher.id}/edit` as any)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#E0F2FE' }]}>
                <Ionicons name="create-outline" size={20} color={Colors.secondary} />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>Edit Data Guru</Text>
                <Text style={styles.actionDesc}>Perbarui nama lengkap, email, atau NIP</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>

            {/* Reset Password Button */}
            <TouchableOpacity
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={() => router.push(`/admin/guru/${teacher.id}/reset-password` as any)}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="key-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.actionTextBox}>
                <Text style={styles.actionTitle}>Reset Password</Text>
                <Text style={styles.actionDesc}>Ubah kata sandi akun guru ini</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>

            {/* Activate / Deactivate Button */}
            <TouchableOpacity
              style={[
                styles.actionButton,
                teacher.isActive ? styles.deactivateButton : styles.activateButton,
              ]}
              activeOpacity={0.8}
              onPress={handleToggleStatus}
              disabled={isUpdatingStatus}
            >
              <View
                style={[
                  styles.actionIconBox,
                  {
                    backgroundColor: teacher.isActive ? '#FEE2E2' : '#DCFCE7',
                  },
                ]}
              >
                <Ionicons
                  name={teacher.isActive ? 'lock-closed-outline' : 'lock-open-outline'}
                  size={20}
                  color={teacher.isActive ? Colors.error : Colors.success}
                />
              </View>
              <View style={styles.actionTextBox}>
                <Text
                  style={[
                    styles.actionTitle,
                    { color: teacher.isActive ? Colors.error : Colors.success },
                  ]}
                >
                  {teacher.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun Kembali'}
                </Text>
                <Text style={styles.actionDesc}>
                  {teacher.isActive
                    ? 'Blokir akses masuk guru ke sistem'
                    : 'Buka kembali akses masuk guru'}
                </Text>
              </View>
              {isUpdatingStatus ? (
                <ActivityIndicator size="small" color={teacher.isActive ? Colors.error : Colors.success} />
              ) : (
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={teacher.isActive ? Colors.error : Colors.success}
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
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLargeText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.secondary,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  teacherRole: {
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
