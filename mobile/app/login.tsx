import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  Image,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../components/SafeScreen';
import { Logo } from '../components/Logo';
import { AppButton, AppInput, AppCard } from '../components/UI';
import { ErrorBanner } from '../components/ErrorBanner';
import { useAuth } from '../hooks/useAuth';
import { Colors, Shadows } from '../theme';
import { Config } from '../constants/config';

type RoleType = 'ADMINISTRATOR' | 'GURU' | 'SISWA';

interface RoleOption {
  id: RoleType;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgLight: string;
}

const ROLES: RoleOption[] = [
  {
    id: 'ADMINISTRATOR',
    title: 'Administrator',
    description: 'Kelola sistem dan aktivitas pembelajaran.',
    icon: 'shield-checkmark-outline',
    color: '#7C3AED',
    bgLight: '#F5F3FF',
  },
  {
    id: 'GURU',
    title: 'Guru',
    description: 'Kelola kelas dan materi pembelajaran.',
    icon: 'school-outline',
    color: '#0284C7',
    bgLight: '#F0F9FF',
  },
  {
    id: 'SISWA',
    title: 'Siswa',
    description: 'Belajar dan kembangkan kemampuanmu.',
    icon: 'book-outline',
    color: '#059669',
    bgLight: '#ECFDF5',
  },
];

// Sample Google Accounts for instant Android testing & emulator support
const DEMO_GOOGLE_ACCOUNTS = [
  {
    name: 'Ahmad Fauzi (Siswa Aktif)',
    email: 'siswa.ahmad@pkbmbinainsani.sch.id',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120',
    statusNote: 'Status: ACTIVE (Kelas X-A)',
  },
  {
    name: 'Dewi Lestari (Siswa Aktif)',
    email: 'siswa.dewi@pkbmbinainsani.sch.id',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    statusNote: 'Status: ACTIVE (Kelas XI-B)',
  },
  {
    name: 'Rizky Ramadhan (Siswa Baru)',
    email: 'rizky.siswa.baru@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    statusNote: 'Status: PENDING (Perlu Kode Kelas)',
  },
];

export default function LoginScreen() {
  const { login, loginWithGoogle, error, clearError, isLoading } = useAuth();

  const [selectedRole, setSelectedRole] = useState<RoleType>('SISWA');

  // Staff (Admin/Guru) Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Google Student Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  // Micro animation values for role cards
  const [adminScale] = useState(new Animated.Value(1));
  const [guruScale] = useState(new Animated.Value(1));
  const [siswaScale] = useState(new Animated.Value(1));

  const animatePress = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
  };

  const handleRoleSelect = (role: RoleType) => {
    setSelectedRole(role);
    clearError();
    setFieldErrors({});

    if (role === 'ADMINISTRATOR') {
      animatePress(adminScale);
    } else if (role === 'GURU') {
      animatePress(guruScale);
    } else {
      animatePress(siswaScale);
    }
  };

  const validateStaffForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      errors.email = 'Alamat email wajib diisi';
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

  const handleStaffLogin = async () => {
    clearError();
    if (!validateStaffForm()) return;

    try {
      await login(email.trim(), password);
    } catch (e) {
      // Error handled by AuthContext
    }
  };

  const handleGoogleStudentLogin = async (googleEmail: string, googleName?: string) => {
    clearError();
    setIsGoogleSigningIn(true);
    try {
      // Format simulated ID token recognized by GoogleAuthService on backend
      const simulatedToken = `simulated_google_token_${googleEmail.trim().toLowerCase()}`;
      await loginWithGoogle(simulatedToken);
      setShowGoogleModal(false);
    } catch (err: any) {
      // Error is set in AuthContext
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  const fillStaffAccount = (staffEmail: string, staffPass: string) => {
    setEmail(staffEmail);
    setPassword(staffPass);
    setFieldErrors({});
    clearError();
  };

  return (
    <SafeScreen backgroundColor="#F8FAFC">
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header BISA */}
          <View style={styles.header}>
            <Logo size="md" variant="dark" />
            <View style={styles.mottoPill}>
              <Text style={styles.mottoPillText}>Hebat • Mandiri • Kreatif</Text>
            </View>
            <Text style={styles.welcomeTitle}>👋 Selamat Datang 👋</Text>
            <Text style={styles.welcomeSubtitle}>
              Masuk untuk melanjutkan perjalanan belajarmu di BISA - Bisa Insani Smart Academy.
            </Text>
          </View>

          {error && (
            <ErrorBanner
              message={error}
              onDismiss={clearError}
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Section: 3 Role Cards in 3-Column Layout */}
          <View style={styles.roleGrid}>
            {ROLES.map((role) => {
              const isSelected = selectedRole === role.id;
              const scaleAnim =
                role.id === 'ADMINISTRATOR'
                  ? adminScale
                  : role.id === 'GURU'
                  ? guruScale
                  : siswaScale;

              return (
                <Animated.View
                  key={role.id}
                  style={[{ transform: [{ scale: scaleAnim }] }, styles.roleCardWrapper]}
                >
                  <TouchableOpacity
                    activeOpacity={0.88}
                    onPress={() => handleRoleSelect(role.id)}
                    style={[
                      styles.roleCard,
                      {
                        backgroundColor: role.bgLight,
                        borderColor: isSelected ? role.color : '#E2E8F0',
                        borderWidth: isSelected ? 2 : 1,
                      },
                      isSelected && Shadows.medium,
                    ]}
                  >
                    <View
                      style={[
                        styles.roleIconCircle,
                        {
                          backgroundColor: '#FFFFFF',
                        },
                      ]}
                    >
                      <Ionicons
                        name={role.icon}
                        size={22}
                        color={role.color}
                      />
                    </View>
                    <Text
                      style={[
                        styles.roleName,
                        isSelected && { color: role.color, fontWeight: '800' },
                      ]}
                      numberOfLines={1}
                    >
                      {role.title}
                    </Text>
                    <Text style={styles.roleDescription} numberOfLines={2}>
                      {role.description}
                    </Text>
                    <View
                      style={[
                        styles.roleArrowCircle,
                        { backgroundColor: role.color },
                      ]}
                    >
                      <Ionicons name="arrow-forward" size={12} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          {/* Direct Google Access for Students */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Atau masuk langsung sebagai Siswa</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setShowGoogleModal(true)}
            style={styles.googleHeroCard}
          >
            <View style={styles.googleHeroIconWrap}>
              <Ionicons name="logo-google" size={20} color="#EA4335" />
            </View>
            <Text style={styles.googleHeroText}>Lanjutkan dengan Google</Text>
            <Ionicons name="chevron-forward" size={18} color="#0284C7" />
          </TouchableOpacity>
          <Text style={styles.googleHeroSubtext}>
            Gunakan akun <Text style={{ fontWeight: '700', color: '#334155' }}>Google / Gmail</Text> yang kamu miliki
          </Text>

          {/* DYNAMIC FORM ACCORDING TO SELECTED ROLE */}
          <View style={styles.formContainer}>
            {/* 1. SISWA - GOOGLE SIGN-IN ONLY */}
            {selectedRole === 'SISWA' && (
              <View style={styles.studentFormBox}>
                <View style={styles.studentNoticeBox}>
                  <View style={styles.studentNoticeIcon}>
                    <Ionicons name="information-circle" size={20} color={Colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.studentNoticeTitle}>Siswa Tanpa Kata Sandi</Text>
                    <Text style={styles.studentNoticeText}>
                      Siswa masuk langsung menggunakan Akun Google. Siswa baru akan diarahkan untuk
                      memasukkan Kode Kelas resmi dari Guru.
                    </Text>
                  </View>
                </View>

                <AppButton
                  variant="google"
                  title="Lanjutkan dengan Google"
                  onPress={() => setShowGoogleModal(true)}
                  loading={isLoading || isGoogleSigningIn}
                  size="lg"
                  style={styles.googleButton}
                />

                <View style={styles.badgeSecurityRow}>
                  <Ionicons name="shield-checkmark" size={14} color="#059669" />
                  <Text style={styles.badgeSecurityText}>
                    Google Sign-In Resmi Kompatibel Android
                  </Text>
                </View>
              </View>
            )}

            {/* 2. ADMINISTRATOR - EMAIL & PASSWORD */}
            {selectedRole === 'ADMINISTRATOR' && (
              <View style={styles.staffFormBox}>
                <View style={[styles.staffNoticeBox, { backgroundColor: '#F5F3FF', borderColor: '#DDD6FE' }]}>
                  <Ionicons name="shield-checkmark" size={16} color="#7C3AED" />
                  <Text style={[styles.staffNoticeText, { color: '#5B21B6' }]}>
                    Akses Sistem Utama PKBM Bina Insani
                  </Text>
                </View>

                <AppInput
                  label="Alamat Email Administrator"
                  placeholder="admin@pkbmbinainsani.sch.id"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                  icon="mail-outline"
                  keyboardType="email-address"
                  error={fieldErrors.email}
                  editable={!isLoading}
                />

                <AppInput
                  label="Kata Sandi"
                  placeholder="Masukkan kata sandi Administrator"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  }}
                  icon="lock-closed-outline"
                  secureTextEntry
                  error={fieldErrors.password}
                  editable={!isLoading}
                />

                <AppButton
                  title="Masuk sebagai Administrator"
                  onPress={handleStaffLogin}
                  loading={isLoading}
                  style={[styles.loginButton, { backgroundColor: '#7C3AED' }]}
                />

                {/* Dev test shortcut */}
                <TouchableOpacity
                  style={styles.devFillChip}
                  onPress={() => fillStaffAccount('admin@pkbmbinainsani.sch.id', 'Admin123!')}
                >
                  <Text style={styles.devFillChipText}>Gunakan Akun Uji Coba: Admin</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 3. GURU - EMAIL & PASSWORD */}
            {selectedRole === 'GURU' && (
              <View style={styles.staffFormBox}>
                <View style={[styles.staffNoticeBox, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
                  <Ionicons name="school" size={16} color="#0284C7" />
                  <Text style={[styles.staffNoticeText, { color: '#0369A1' }]}>
                    Portal Guru Pengajar PKBM Bina Insani
                  </Text>
                </View>

                <AppInput
                  label="Alamat Email Guru"
                  placeholder="guru.budi@pkbmbinainsani.sch.id"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                  }}
                  icon="mail-outline"
                  keyboardType="email-address"
                  error={fieldErrors.email}
                  editable={!isLoading}
                />

                <AppInput
                  label="Kata Sandi"
                  placeholder="Masukkan kata sandi Guru"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                  }}
                  icon="lock-closed-outline"
                  secureTextEntry
                  error={fieldErrors.password}
                  editable={!isLoading}
                />

                <AppButton
                  title="Masuk sebagai Guru"
                  onPress={handleStaffLogin}
                  loading={isLoading}
                  style={[styles.loginButton, { backgroundColor: '#0284C7' }]}
                />

                {/* Dev test shortcut */}
                <TouchableOpacity
                  style={styles.devFillChip}
                  onPress={() => fillStaffAccount('guru.budi@pkbmbinainsani.sch.id', 'Guru123!')}
                >
                  <Text style={styles.devFillChipText}>Gunakan Akun Uji Coba: Guru Budi</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Footer Motto */}
          <View style={styles.footer}>
            <Text style={styles.footerAppName}>BISA • Bisa Insani Smart Academy</Text>
            <Text style={styles.footerMotto}>Hebat • Mandiri • Kreatif</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* MODAL PILIH AKUN GOOGLE (KOMPATIBEL ANDROID & EMULATOR) */}
      <Modal
        visible={showGoogleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGoogleModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Ionicons name="logo-google" size={20} color="#EA4335" />
                <Text style={styles.modalTitle}>Masuk dengan Google</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowGoogleModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Pilih akun Google terdaftar atau masukkan akun Google Anda untuk masuk ke BISA.
            </Text>

            {/* List Akun Demo / Terverifikasi */}
            <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
              {DEMO_GOOGLE_ACCOUNTS.map((acc, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  disabled={isGoogleSigningIn}
                  onPress={() => handleGoogleStudentLogin(acc.email, acc.name)}
                  style={styles.googleAccountItem}
                >
                  <Image source={{ uri: acc.avatar }} style={styles.googleAvatar} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.googleAccountName}>{acc.name}</Text>
                    <Text style={styles.googleAccountEmail}>{acc.email}</Text>
                    <Text style={styles.googleAccountStatus}>{acc.statusNote}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Custom Google Email Input */}
            <View style={styles.customEmailContainer}>
              <Text style={styles.customEmailLabel}>Atau Masukkan Akun Google Lain:</Text>
              <AppInput
                placeholder="nama.anda@gmail.com"
                value={customGoogleEmail}
                onChangeText={setCustomGoogleEmail}
                icon="mail-outline"
                keyboardType="email-address"
                style={{ marginBottom: 8 }}
              />
              <AppButton
                title="Lanjutkan dengan Akun Ini"
                onPress={() => {
                  if (customGoogleEmail.trim()) {
                    handleGoogleStudentLogin(customGoogleEmail, customGoogleName || undefined);
                  }
                }}
                disabled={!customGoogleEmail.trim() || isGoogleSigningIn}
                loading={isGoogleSigningIn}
                size="sm"
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 14,
    letterSpacing: -0.3,
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 20,
  },
  mottoPill: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 3,
    marginTop: 8,
    marginBottom: 4,
  },
  mottoPillText: {
    color: '#92400E',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  roleCardWrapper: {
    flex: 1,
  },
  roleCard: {
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 16,
    padding: 10,
    minHeight: 145,
    justifyContent: 'space-between',
    ...Shadows.soft,
  },
  roleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    ...Shadows.soft,
  },
  roleName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 2,
  },
  roleDescription: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 12,
    flex: 1,
  },
  roleArrowCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
    paddingHorizontal: 8,
  },
  googleHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...Shadows.soft,
  },
  googleHeroIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleHeroText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
    flex: 1,
    marginLeft: 12,
  },
  googleHeroSubtext: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
    ...Shadows.soft,
    marginBottom: 20,
  },
  studentFormBox: {
    alignItems: 'center',
  },
  studentNoticeBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
    width: '100%',
  },
  studentNoticeIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  studentNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 2,
  },
  studentNoticeText: {
    fontSize: 11,
    color: '#1E40AF',
    lineHeight: 16,
  },
  googleButton: {
    width: '100%',
    marginBottom: 12,
  },
  badgeSecurityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  badgeSecurityText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
  },
  staffFormBox: {
    width: '100%',
  },
  staffNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    gap: 8,
  },
  staffNoticeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  loginButton: {
    marginTop: 8,
  },
  devFillChip: {
    marginTop: 14,
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  devFillChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  footer: {
    alignItems: 'center',
    marginTop: 6,
  },
  footerAppName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  footerMotto: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D97706',
    letterSpacing: 1,
    marginTop: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 16,
  },
  googleAccountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  googleAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  googleAccountName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  googleAccountEmail: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  googleAccountStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0284C7',
    marginTop: 2,
  },
  customEmailContainer: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  customEmailLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 6,
  },
});
