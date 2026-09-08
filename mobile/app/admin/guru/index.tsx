import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../components/SafeScreen';
import { Colors } from '../../../constants/colors';
import { TeacherService } from '../../../services/teacherService';
import { TeacherItem } from '../../../types/userManagement';
import { useProtectedRoute } from '../../../hooks/useProtectedRoute';

export default function DaftarGuruScreen() {
  useProtectedRoute(['ADMIN']);
  const router = useRouter();

  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTeachers = async (pageToFetch = 1, searchQuery = search, isRefresh = false) => {
    try {
      if (!isRefresh && pageToFetch === 1) {
        setIsLoading(true);
      }
      setError(null);
      const res = await TeacherService.getTeachers(pageToFetch, 15, searchQuery);
      if (res.data) {
        setTeachers(res.data);
        setPage(res.pagination.page);
        setTotalPages(res.pagination.totalPages);
        setTotal(res.pagination.total);
      }
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data guru');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Re-fetch when screen gains focus to capture any updates
  useFocusEffect(
    useCallback(() => {
      fetchTeachers(1, search, true);
    }, [search])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTeachers(1, search, true);
  };

  const handleSearchSubmit = () => {
    setPage(1);
    fetchTeachers(1, search);
  };

  const handleClearSearch = () => {
    setSearch('');
    setPage(1);
    fetchTeachers(1, '');
  };

  const renderItem = ({ item }: { item: TeacherItem }) => (
    <TouchableOpacity
      style={styles.teacherCard}
      activeOpacity={0.7}
      onPress={() => router.push(`/admin/guru/${item.id}` as any)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {item.email}
          </Text>
          <View style={styles.nipBadge}>
            <Ionicons name="card-outline" size={12} color={Colors.primary} />
            <Text style={styles.nipText}>
              NIP: {item.teacher?.teacherNumber || '-'}
            </Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View
            style={[
              styles.statusBadge,
              item.isActive ? styles.statusActive : styles.statusInactive,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: item.isActive ? Colors.success : Colors.error },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: item.isActive ? Colors.success : Colors.error },
              ]}
            >
              {item.isActive ? 'Aktif' : 'Nonaktif'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} style={{ marginTop: 8 }} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeScreen backgroundColor={Colors.background}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Manajemen Guru</Text>
          <Text style={styles.headerSubtitle}>
            {total} Guru Terdaftar di Sistem
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => router.push('/admin/guru/tambah' as any)}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari berdasarkan nama, email, atau NIP..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat data guru...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
          <Text style={styles.errorTitle}>Gagal Mengambil Data</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchTeachers(1, search)}>
            <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.retryButtonText}>Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={teachers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[Colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="people-outline" size={36} color={Colors.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>Tidak Ada Guru Ditemukan</Text>
              <Text style={styles.emptySubtitle}>
                {search
                  ? `Tidak ada data yang cocok dengan "${search}"`
                  : 'Belum ada data guru. Tekan tombol Tambah untuk membuat akun guru baru.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  teacherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.secondary,
  },
  cardInfo: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  email: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  nipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  nipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 4,
  },
  cardRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 44,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusActive: {
    backgroundColor: Colors.successLight,
  },
  statusInactive: {
    backgroundColor: Colors.errorLight,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
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
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
