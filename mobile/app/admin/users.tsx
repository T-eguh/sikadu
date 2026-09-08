import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../components/SafeScreen';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { Colors } from '../../constants/colors';

const initialUsers = [
  { id: '1', name: 'Administrator Utama', email: 'admin@sekolahmodel.sch.id', role: 'ADMIN', badge: 'Admin' },
  { id: '2', name: 'Budi Santoso, S.Pd.', email: 'guru.budi@sekolahmodel.sch.id', role: 'TEACHER', badge: 'NIP: 198501152010011001' },
  { id: '3', name: 'Siti Rahmawati, M.Pd.', email: 'guru.siti@sekolahmodel.sch.id', role: 'TEACHER', badge: 'NIP: 198803202012022002' },
  { id: '4', name: 'Ahmad Fauzi', email: 'siswa.ahmad@sekolahmodel.sch.id', role: 'STUDENT', badge: 'NIS: 24001' },
  { id: '5', name: 'Dewi Lestari', email: 'siswa.dewi@sekolahmodel.sch.id', role: 'STUDENT', badge: 'NIS: 24002' },
  { id: '6', name: 'Reza Pratama', email: 'siswa.reza@sekolahmodel.sch.id', role: 'STUDENT', badge: 'NIS: 24003' },
  { id: '7', name: 'Anisa Nurul', email: 'siswa.anisa@sekolahmodel.sch.id', role: 'STUDENT', badge: 'NIS: 24004' },
  { id: '8', name: 'Fajar Hidayat', email: 'siswa.fajar@sekolahmodel.sch.id', role: 'STUDENT', badge: 'NIS: 24005' },
];

export default function AdminUsersScreen() {
  useProtectedRoute(['ADMIN']);
  const [filter, setFilter] = useState<'ALL' | 'TEACHER' | 'STUDENT'>('ALL');

  const filteredUsers = initialUsers.filter((u) => {
    if (filter === 'ALL') return true;
    return u.role === filter;
  });

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header title="Kelola Pengguna" subtitle="Daftar Guru & Siswa" />

      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'ALL' && styles.filterChipActive]}
          onPress={() => setFilter('ALL')}
        >
          <Text style={[styles.filterText, filter === 'ALL' && styles.filterTextActive]}>
            Semua ({initialUsers.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'TEACHER' && styles.filterChipActive]}
          onPress={() => setFilter('TEACHER')}
        >
          <Text style={[styles.filterText, filter === 'TEACHER' && styles.filterTextActive]}>
            Guru (2)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'STUDENT' && styles.filterChipActive]}
          onPress={() => setFilter('STUDENT')}
        >
          <Text style={[styles.filterText, filter === 'STUDENT' && styles.filterTextActive]}>
            Siswa (5)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {filteredUsers.map((item) => (
          <Card key={item.id} style={styles.userCard}>
            <View style={styles.userRow}>
              <View
                style={[
                  styles.avatarBox,
                  {
                    backgroundColor:
                      item.role === 'ADMIN'
                        ? Colors.roles.adminLight
                        : item.role === 'TEACHER'
                        ? Colors.roles.teacherLight
                        : Colors.roles.studentLight,
                  },
                ]}
              >
                <Ionicons
                  name={
                    item.role === 'ADMIN'
                      ? 'shield-checkmark'
                      : item.role === 'TEACHER'
                      ? 'person'
                      : 'school'
                  }
                  size={20}
                  color={
                    item.role === 'ADMIN'
                      ? Colors.roles.admin
                      : item.role === 'TEACHER'
                      ? Colors.roles.teacher
                      : Colors.roles.student
                  }
                />
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userBadge}>{item.badge}</Text>
              </View>
              <View style={styles.activeTag}>
                <View style={styles.activeDot} />
                <Text style={styles.activeText}>Aktif</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  userCard: {
    padding: 14,
    marginBottom: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userBadge: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.successLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 4,
  },
  activeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
});
