import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../../components/SafeScreen';
import { Input } from '../../../../components/Input';
import { Button } from '../../../../components/Button';
import { Colors } from '../../../../constants/colors';
import { StudentService } from '../../../../services/studentService';
import { useProtectedRoute } from '../../../../hooks/useProtectedRoute';

export default function EditSiswaScreen() {
  useProtectedRoute(['ADMIN']);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [nisn, setNisn] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    const loadStudent = async () => {
      if (!id) return;
      try {
        setIsLoadingData(true);
        const data = await StudentService.getStudentById(id);
        setName(data.name);
        setEmail(data.email);
        setStudentNumber(data.student?.studentNumber || '');
        setNisn(data.student?.nisn || '');
      } catch (err: any) {
        setGeneralError(err.message || 'Gagal memuat data siswa.');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadStudent();
  }, [id]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Nama lengkap siswa wajib diisi.';
    } else if (name.trim().length < 2) {
      errs.name = 'Nama lengkap minimal 2 karakter.';
    }

    if (!email.trim()) {
      errs.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Format email tidak valid.';
    }

    if (!studentNumber.trim()) {
      errs.studentNumber = 'Nomor Induk Siswa (NIS) wajib diisi.';
    } else if (studentNumber.trim().length < 2) {
      errs.studentNumber = 'NIS minimal 2 karakter.';
    }

    if (!nisn.trim()) {
      errs.nisn = 'NISN wajib diisi.';
    } else if (nisn.trim().length < 5) {
      errs.nisn = 'NISN minimal 5 karakter.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    setGeneralError(null);
    if (!validate() || !id) return;

    setIsSaving(true);
    try {
      await StudentService.updateStudent(id, {
        name: name.trim(),
        email: email.trim(),
        studentNumber: studentNumber.trim(),
        nisn: nisn.trim(),
      });

      Alert.alert('Sukses', 'Data siswa berhasil diperbarui.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      setGeneralError(err.message || 'Gagal memperbarui data siswa.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeScreen backgroundColor={Colors.background}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Data Siswa</Text>
        <View style={{ width: 36 }} />
      </View>

      {isLoadingData ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.roles.student} />
          <Text style={styles.loadingText}>Memuat form...</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {generalError && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={Colors.error} />
                <Text style={styles.errorBoxText}>{generalError}</Text>
              </View>
            )}

            <View style={styles.formCard}>
              <Text style={styles.sectionHeader}>Perbarui Profil Siswa</Text>

              <Input
                label="Nama Lengkap Siswa *"
                placeholder="Contoh: Muhammad Rizky"
                leftIcon="person-outline"
                value={name}
                onChangeText={setName}
                error={errors.name}
              />

              <Input
                label="Alamat Email *"
                placeholder="Contoh: siswa.rizky@pkbmbinainsani.sch.id"
                leftIcon="mail-outline"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={errors.email}
              />

              <Input
                label="Nomor Induk Siswa (NIS) *"
                placeholder="Contoh: 2024001"
                leftIcon="finger-print-outline"
                keyboardType="number-pad"
                value={studentNumber}
                onChangeText={setStudentNumber}
                error={errors.studentNumber}
              />

              <Input
                label="Nomor Induk Siswa Nasional (NISN) *"
                placeholder="Contoh: 0081234567"
                leftIcon="ribbon-outline"
                keyboardType="number-pad"
                value={nisn}
                onChangeText={setNisn}
                error={errors.nisn}
              />

              <View style={styles.passwordNote}>
                <Ionicons name="shield-checkmark-outline" size={16} color={Colors.roles.student} />
                <Text style={styles.passwordNoteText}>
                  Kata sandi aman dan terenkripsi. Gunakan tombol Reset Password pada halaman detail jika siswa lupa kata sandi.
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                title="Simpan Perubahan"
                onPress={handleSave}
                isLoading={isSaving}
                variant="secondary"
                icon={<Ionicons name="save-outline" size={20} color="#FFFFFF" />}
              />
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.errorLight,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  errorBoxText: {
    color: Colors.error,
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  passwordNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  passwordNoteText: {
    fontSize: 12,
    color: Colors.roles.student,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 14,
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
});
