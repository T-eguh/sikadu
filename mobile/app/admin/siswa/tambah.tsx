import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../components/SafeScreen';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { Colors } from '../../../constants/colors';
import { StudentService } from '../../../services/studentService';
import { useProtectedRoute } from '../../../hooks/useProtectedRoute';

export default function TambahSiswaScreen() {
  useProtectedRoute(['ADMIN']);
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [nisn, setNisn] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!name.trim()) {
      errs.name = 'Nama lengkap wajib diisi.';
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

    if (!password) {
      errs.password = 'Kata sandi wajib diisi.';
    } else if (password.length < 6) {
      errs.password = 'Kata sandi minimal 6 karakter.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    setGeneralError(null);
    if (!validate()) return;

    setIsLoading(true);
    try {
      await StudentService.createStudent({
        name: name.trim(),
        email: email.trim(),
        studentNumber: studentNumber.trim(),
        nisn: nisn.trim(),
        password,
      });

      Alert.alert('Berhasil', 'Siswa baru berhasil didaftarkan ke sistem.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      setGeneralError(err.message || 'Gagal mendaftarkan siswa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeScreen backgroundColor={Colors.background}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftarkan Siswa Baru</Text>
        <View style={{ width: 36 }} />
      </View>

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
            <Text style={styles.sectionHeader}>Informasi Akun & Peserta Didik</Text>

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

            <Input
              label="Kata Sandi Awal *"
              placeholder="Minimal 6 karakter"
              leftIcon="lock-closed-outline"
              isPassword
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />

            <Text style={styles.passwordHint}>
              Siswa dapat langsung login ke aplikasi menggunakan email dan kata sandi di atas.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Simpan Data Siswa"
              onPress={handleSubmit}
              isLoading={isLoading}
              variant="secondary"
              icon={<Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  passwordHint: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: -8,
    marginBottom: 8,
    fontStyle: 'italic',
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
});
