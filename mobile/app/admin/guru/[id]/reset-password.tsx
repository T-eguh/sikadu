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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../../components/SafeScreen';
import { Input } from '../../../../components/Input';
import { Button } from '../../../../components/Button';
import { Colors } from '../../../../constants/colors';
import { TeacherService } from '../../../../services/teacherService';
import { useProtectedRoute } from '../../../../hooks/useProtectedRoute';

export default function ResetPasswordGuruScreen() {
  useProtectedRoute(['ADMIN']);
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!newPassword) {
      errs.newPassword = 'Kata sandi baru wajib diisi.';
    } else if (newPassword.length < 6) {
      errs.newPassword = 'Kata sandi baru minimal 6 karakter.';
    }

    if (!confirmPassword) {
      errs.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = 'Konfirmasi kata sandi tidak cocok.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleReset = async () => {
    setGeneralError(null);
    if (!validate() || !id) return;

    setIsSubmitting(true);
    try {
      await TeacherService.resetPassword(id, newPassword);

      Alert.alert(
        'Berhasil',
        'Kata sandi akun guru berhasil diperbarui. Guru dapat login menggunakan kata sandi baru.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err: any) {
      setGeneralError(err.message || 'Gagal mereset kata sandi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeScreen backgroundColor={Colors.background}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Kata Sandi</Text>
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
            <View style={styles.iconCircle}>
              <Ionicons name="key-outline" size={28} color={Colors.primary} />
            </View>

            <Text style={styles.formTitle}>Atur Ulang Kata Sandi Guru</Text>
            <Text style={styles.formSubtitle}>
              Masukkan kata sandi baru untuk akun pengajar ini. Kata sandi lama akan langsung digantikan dan dienkripsi secara aman.
            </Text>

            <Input
              label="Kata Sandi Baru *"
              placeholder="Minimal 6 karakter"
              leftIcon="lock-closed-outline"
              isPassword
              value={newPassword}
              onChangeText={setNewPassword}
              error={errors.newPassword}
            />

            <Input
              label="Konfirmasi Kata Sandi Baru *"
              placeholder="Ulangi kata sandi baru"
              leftIcon="shield-checkmark-outline"
              isPassword
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Perbarui Kata Sandi"
              onPress={handleReset}
              isLoading={isSubmitting}
              icon={<Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={isSubmitting}
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
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: '#EDE9FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
    lineHeight: 18,
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
