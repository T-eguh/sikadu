import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../components/SafeScreen';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { Colors } from '../../constants/colors';

export default function AdminProfileScreen() {
  useProtectedRoute(['ADMIN']);
  const { user, logout } = useAuth();

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header title="Profil Saya" subtitle="Administrator" showLogout={false} />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Profile Header Card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatarSection}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarLetter}>{user?.name?.charAt(0) || 'A'}</Text>
              </View>
            )}
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.rolePill}>
              <Ionicons name="shield-checkmark" size={14} color={Colors.roles.admin} />
              <Text style={styles.rolePillText}>Administrator Sistem</Text>
            </View>
          </View>
        </Card>

        {/* Account Details */}
        <Text style={styles.sectionTitle}>Informasi Akun</Text>
        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID Pengguna</Text>
            <Text style={styles.infoValue}>{user?.id?.slice(0, 8)}... (UUID)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hak Akses</Text>
            <Text style={styles.infoValue}>Full Control (Admin)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status Akun</Text>
            <Text style={[styles.infoValue, { color: Colors.success, fontWeight: '700' }]}>
              Aktif Terverifikasi
            </Text>
          </View>
        </Card>

        {/* System Details */}
        <Text style={styles.sectionTitle}>Spesifikasi Sistem</Text>
        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Aplikasi</Text>
            <Text style={styles.infoValue}>Sekolah Model Mobile</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tahap Rilis</Text>
            <Text style={styles.infoValue}>Tahap 1 (Fondasi & Auth)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Penyimpanan Token</Text>
            <Text style={styles.infoValue}>expo-secure-store</Text>
          </View>
        </Card>

        {/* Logout Button */}
        <Button
          title="Keluar dari Aplikasi (Logout)"
          onPress={logout}
          variant="danger"
          icon={<Ionicons name="log-out-outline" size={18} color="#FFFFFF" />}
          style={styles.logoutBtn}
        />
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
  profileCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  email: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.roles.adminLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.roles.admin,
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  logoutBtn: {
    marginTop: 16,
  },
});
