import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeScreen } from '../components/SafeScreen';
import { Logo } from '../components/Logo';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAuth } from '../hooks/useAuth';
import { Colors } from '../constants/colors';

export default function LoginScreen() {
  const { login, error, clearError, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!password) {
      errors.password = 'Kata sandi wajib diisi';
    } else if (password.length < 6) {
      errors.password = 'Kata sandi minimal 6 karakter';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    clearError();
    if (!validate()) return;

    try {
      await login(email.trim(), password);
    } catch (e) {
      // Error handled by AuthContext
    }
  };

  // Development Quick-Fill Helpers
  const fillDevAccount = (devEmail: string, devPass: string) => {
    setEmail(devEmail);
    setPassword(devPass);
    setFieldErrors({});
    clearError();
  };

  return (
    <SafeScreen backgroundColor="#FFFFFF">
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Logo size="md" variant="dark" />
            <Text style={styles.welcomeText}>Selamat Datang</Text>
            <Text style={styles.instructionText}>
              Masuk ke akun Anda untuk memulai pembelajaran digital
            </Text>
          </View>

          {error ? (
            <ErrorBanner
              message={error}
              onRetry={handleLogin}
              onDismiss={clearError}
            />
          ) : null}

          <View style={styles.form}>
            <Input
              label="Alamat Email"
              placeholder="nama@sekolahmodel.sch.id"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
              }}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoComplete="email"
              error={fieldErrors.email}
              editable={!isLoading}
            />

            <Input
              label="Kata Sandi"
              placeholder="Masukkan kata sandi Anda"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
              }}
              leftIcon="lock-closed-outline"
              isPassword
              error={fieldErrors.password}
              editable={!isLoading}
            />

            <Button
              title="Masuk ke Akun"
              onPress={handleLogin}
              isLoading={isLoading}
              style={styles.loginButton}
            />
          </View>

          {/* Development Quick Account Switcher for convenient mobile testing */}
          <View style={styles.devSection}>
            <Text style={styles.devTitle}>Akun Uji Coba (Development Seed)</Text>
            <View style={styles.chipRow}>
              <TouchableOpacity
                style={[styles.devChip, { borderColor: Colors.roles.admin }]}
                onPress={() => fillDevAccount('admin@sekolahmodel.sch.id', 'Admin123!')}
              >
                <Text style={[styles.devChipText, { color: Colors.roles.admin }]}>Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.devChip, { borderColor: Colors.roles.teacher }]}
                onPress={() => fillDevAccount('guru.budi@sekolahmodel.sch.id', 'Guru123!')}
              >
                <Text style={[styles.devChipText, { color: Colors.roles.teacher }]}>Guru Budi</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.devChip, { borderColor: Colors.roles.student }]}
                onPress={() => fillDevAccount('siswa.ahmad@sekolahmodel.sch.id', 'Siswa123!')}
              >
                <Text style={[styles.devChipText, { color: Colors.roles.student }]}>Siswa Ahmad</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerNote}>
              Sekolah Model LMS • Satu Akun untuk Semua Peran
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 18,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 16,
  },
  form: {
    width: '100%',
    marginTop: 8,
  },
  loginButton: {
    marginTop: 10,
  },
  devSection: {
    marginTop: 28,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    alignItems: 'center',
  },
  devTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  devChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  devChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerNote: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
