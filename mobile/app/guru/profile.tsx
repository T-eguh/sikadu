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

export default function TeacherProfileScreen() {
  useProtectedRoute(['TEACHER']);
  const { user, logout } = useAuth();

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header title="Profil Guru" subtitle="Data Pengajar" showLogout={false} />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Card style={styles.profileCard}>
          <View style={styles.avatarSection}>
            {user?.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarLetter}>{user?.name?.charAt(0) || 'G'}</Text>
              </View>
            )}
            <Text style={styles.name}>{user?.name}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.rolePill}>
              <Ionicons name="school" size={14} color={Colors.secondary} />
              <Text style={styles.rolePillText}>Guru Pengajar Terverifikasi</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Data Kepegawaian</Text>
        <Card>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nomor Induk Pegawai (NIP)</Text>
            <Text style={styles.infoValue}>
              {user?.teacher?.teacherNumber || '198501152010011001'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mata Pelajaran Utama</Text>
            <Text style={styles.infoValue}>Matematika & Sains</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status Kepegawaian</Text>
            <Text style={[styles.infoValue, { color: Colors.success, fontWeight: '700' }]}>
              Aktif Mengajar
            </Text>
          </View>
        </Card>

        <Button
          title="Keluar dari Akun (Logout)"
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
    backgroundColor: Colors.secondary,
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
    backgroundColor: Colors.roles.teacherLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 10,
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
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
    marginTop: 20,
  },
});
