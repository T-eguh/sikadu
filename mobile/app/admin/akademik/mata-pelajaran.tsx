import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../components/SafeScreen';
import { Card } from '../../../components/Card';
import { useProtectedRoute } from '../../../hooks/useProtectedRoute';
import { Colors } from '../../../constants/colors';
import { AcademicService } from '../../../services/academicService';
import { SubjectItem } from '../../../types/academic';

export default function MataPelajaranScreen() {
  useProtectedRoute(['ADMIN']);
  const router = useRouter();

  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<SubjectItem | null>(null);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const res = await AcademicService.getSubjects(1, 100, search);
      setSubjects(res.data);
    } catch (e: any) {
      Alert.alert('Gagal Memuat Data', e.response?.data?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setName('');
    setCode('');
    setDescription('');
    setIsActive(true);
    setFormError('');
    setModalVisible(true);
  };

  const openEditModal = (item: SubjectItem) => {
    setEditingItem(item);
    setName(item.name);
    setCode(item.code);
    setDescription(item.description || '');
    setIsActive(item.isActive);
    setFormError('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !code.trim()) {
      setFormError('Nama mata pelajaran dan Kode mapel wajib diisi');
      return;
    }

    try {
      setActionLoading(true);
      setFormError('');
      if (editingItem) {
        await AcademicService.updateSubject(editingItem.id, {
          name: name.trim(),
          code: code.trim().toUpperCase(),
          description: description.trim() || undefined,
          isActive,
        });
        Alert.alert('Sukses', 'Mata pelajaran berhasil diperbarui.');
      } else {
        await AcademicService.createSubject({
          name: name.trim(),
          code: code.trim().toUpperCase(),
          description: description.trim() || undefined,
          isActive,
        });
        Alert.alert('Sukses', 'Mata pelajaran baru berhasil ditambahkan.');
      }
      setModalVisible(false);
      loadData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan mata pelajaran.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (item: SubjectItem) => {
    try {
      setActionLoading(true);
      await AcademicService.setSubjectStatus(item.id, !item.isActive);
      loadData();
    } catch (err: any) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal mengubah status mata pelajaran.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <SafeScreen backgroundColor={Colors.background}>
      {/* Top Bar Navigation */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.topBarTitles}>
          <Text style={styles.topBarTitle}>Mata Pelajaran</Text>
          <Text style={styles.topBarSubtitle}>Daftar Kurikulum Pembelajaran</Text>
        </View>
        <TouchableOpacity style={styles.addHeaderBtn} onPress={openCreateModal}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari kode atau nama mapel..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat daftar mata pelajaran...</Text>
        </View>
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="book-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Tidak Ada Mata Pelajaran</Text>
              <Text style={styles.emptySub}>
                {search ? 'Tidak ditemukan hasil yang cocok.' : 'Silakan tambah mata pelajaran baru.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card style={styles.itemCard}>
              <View style={styles.cardHeader}>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>{item.code}</Text>
                </View>
                <View style={styles.headerActions}>
                  <TouchableOpacity
                    style={styles.actionIconBtn}
                    onPress={() => openEditModal(item)}
                  >
                    <Ionicons name="create-outline" size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.subjectName}>{item.name}</Text>
              {item.description ? (
                <Text style={styles.subjectDesc}>{item.description}</Text>
              ) : null}

              <View style={styles.cardFooter}>
                <View style={styles.assignmentsCount}>
                  <Ionicons name="people-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.assignmentsText}>
                    {item._count?.teachingAssignments ?? 0} Pengajar
                  </Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.statusToggleBtn,
                    item.isActive ? styles.btnActive : styles.btnInactive,
                  ]}
                  onPress={() => handleToggleStatus(item)}
                  disabled={actionLoading}
                >
                  <Text
                    style={[
                      styles.statusToggleText,
                      item.isActive ? styles.textActive : styles.textInactive,
                    ]}
                  >
                    {item.isActive ? 'Aktif' : 'Nonaktif'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      )}

      {/* Modal Form Tambah / Edit Mapel */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Mata Pelajaran' : 'Tambah Mata Pelajaran Baru'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {formError ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>Kode Mata Pelajaran (Unik)</Text>
            <TextInput
              style={styles.textInput}
              value={code}
              onChangeText={(val) => setCode(val.toUpperCase())}
              placeholder="Contoh: MTK-01"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="characters"
            />

            <Text style={styles.inputLabel}>Nama Mata Pelajaran</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Contoh: Matematika"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.inputLabel}>Deskripsi / Silabus Singkat (Opsional)</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Keterangan materi pembelajaran..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsActive(!isActive)}
            >
              <Ionicons
                name={isActive ? 'checkbox' : 'square-outline'}
                size={22}
                color={isActive ? Colors.primary : Colors.textMuted}
              />
              <Text style={styles.checkboxLabel}>Mata Pelajaran Aktif</Text>
            </TouchableOpacity>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
                disabled={actionLoading}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Simpan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitles: {
    flex: 1,
    marginLeft: 8,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  topBarSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  addHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Colors.text,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
  },
  emptySub: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
  },
  itemCard: {
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  codeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBtn: {
    padding: 6,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  subjectDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  assignmentsCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assignmentsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  statusToggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnActive: {
    backgroundColor: '#ECFDF5',
  },
  textActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  btnInactive: {
    backgroundColor: '#F1F5F9',
  },
  textInactive: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    marginLeft: 6,
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: Colors.text,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  checkboxLabel: {
    fontSize: 13,
    color: Colors.text,
    marginLeft: 8,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    minWidth: 90,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
