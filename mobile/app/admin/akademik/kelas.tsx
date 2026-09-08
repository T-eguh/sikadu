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
import { TeacherService } from '../../../services/teacherService';
import { ClassItem, AcademicYearItem } from '../../../types/academic';
import { TeacherItem } from '../../../types/userManagement';

export default function KelasScreen() {
  useProtectedRoute(['ADMIN']);
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ClassItem | null>(null);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('7');
  const [academicYearId, setAcademicYearId] = useState('');
  const [homeroomTeacherId, setHomeroomTeacherId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [classRes, ayRes, teacherRes] = await Promise.all([
        AcademicService.getClasses(1, 100, search, selectedGrade),
        AcademicService.getAcademicYears(),
        TeacherService.getTeachers(1, 100),
      ]);
      setClasses(classRes.data);
      setAcademicYears(ayRes.data);
      setTeachers(teacherRes.data);

      const activeAy = ayRes.data.find((y: any) => y.isActive);
      if (activeAy && !academicYearId) {
        setAcademicYearId(activeAy.id);
      }
    } catch (e: any) {
      Alert.alert('Gagal Memuat Data', e.response?.data?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, selectedGrade, academicYearId]);

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
    setGrade('7');
    const activeAy = academicYears.find((y) => y.isActive);
    setAcademicYearId(activeAy ? activeAy.id : academicYears[0]?.id || '');
    setHomeroomTeacherId(null);
    setIsActive(true);
    setFormError('');
    setModalVisible(true);
  };

  const openEditModal = (item: ClassItem) => {
    setEditingItem(item);
    setName(item.name);
    setGrade(item.grade);
    setAcademicYearId(item.academicYearId);
    setHomeroomTeacherId(item.homeroomTeacherId || null);
    setIsActive(item.isActive);
    setFormError('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setFormError('Nama kelas wajib diisi (contoh: 7A)');
      return;
    }
    if (!grade.trim()) {
      setFormError('Tingkat kelas wajib dipilih');
      return;
    }
    if (!academicYearId) {
      setFormError('Tahun ajaran wajib dipilih');
      return;
    }

    try {
      setActionLoading(true);
      setFormError('');
      if (editingItem) {
        await AcademicService.updateClass(editingItem.id, {
          name: name.trim(),
          grade: grade.trim(),
          academicYearId,
          homeroomTeacherId,
          isActive,
        });
        Alert.alert('Sukses', 'Data kelas berhasil diperbarui.');
      } else {
        await AcademicService.createClass({
          name: name.trim(),
          grade: grade.trim(),
          academicYearId,
          homeroomTeacherId,
          isActive,
        });
        Alert.alert('Sukses', 'Kelas baru berhasil dibuat.');
      }
      setModalVisible(false);
      loadData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan data kelas.');
    } finally {
      setActionLoading(false);
    }
  };

  const gradeOptions = ['Semua', '7', '8', '9', '10', '11', '12'];

  return (
    <SafeScreen backgroundColor={Colors.background}>
      {/* Top Bar Navigation */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.topBarTitles}>
          <Text style={styles.topBarTitle}>Manajemen Kelas</Text>
          <Text style={styles.topBarSubtitle}>Rombongan Belajar & Siswa</Text>
        </View>
        <TouchableOpacity style={styles.addHeaderBtn} onPress={openCreateModal}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Grade Filters */}
      <View style={styles.gradeFilterRow}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={gradeOptions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = item === 'Semua' ? selectedGrade === '' : selectedGrade === item;
            return (
              <TouchableOpacity
                style={[styles.gradeChip, isSelected && styles.gradeChipActive]}
                onPress={() => setSelectedGrade(item === 'Semua' ? '' : item)}
              >
                <Text style={[styles.gradeChipText, isSelected && styles.gradeChipTextActive]}>
                  {item === 'Semua' ? 'Semua Tingkat' : `Kelas ${item}`}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama kelas (contoh: 7A, 8B)..."
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
          <Text style={styles.loadingText}>Memuat data kelas...</Text>
        </View>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="easel-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Tidak Ada Kelas</Text>
              <Text style={styles.emptySub}>
                Belum ada kelas yang dibuat atau filter tidak sesuai.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push(`/admin/akademik/kelas-detail?id=${item.id}` as any)}
            >
              <Card style={styles.itemCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.nameBlock}>
                    <View style={styles.titleRow}>
                      <Text style={styles.className}>{item.name}</Text>
                      <View style={styles.gradeBadge}>
                        <Text style={styles.gradeBadgeText}>Tingkat {item.grade}</Text>
                      </View>
                    </View>
                    <Text style={styles.academicYearText}>
                      TA: {item.academicYear?.name || '-'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={(e) => {
                      e.stopPropagation();
                      openEditModal(item);
                    }}
                  >
                    <Ionicons name="create-outline" size={18} color={Colors.textSecondary} />
                  </TouchableOpacity>
                </View>

                {/* Homeroom Teacher */}
                <View style={styles.metaRow}>
                  <Ionicons name="person-outline" size={14} color={Colors.textMuted} />
                  <Text style={styles.metaText}>
                    Wali Kelas:{' '}
                    <Text style={styles.metaBold}>
                      {item.homeroomTeacher ? item.homeroomTeacher.user.name : 'Belum ditentukan'}
                    </Text>
                  </Text>
                </View>

                {/* Footer with Student Count and Arrow */}
                <View style={styles.cardFooter}>
                  <View style={styles.studentBadge}>
                    <Ionicons name="people" size={14} color={Colors.primary} />
                    <Text style={styles.studentBadgeText}>
                      {item._count?.students ?? 0} Siswa Terdaftar
                    </Text>
                  </View>

                  <View style={styles.viewDetailRow}>
                    <Text style={styles.viewDetailText}>Kelola Siswa</Text>
                    <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal Tambah / Edit Kelas */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Data Kelas' : 'Buat Kelas Baru'}
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

            <Text style={styles.inputLabel}>Nama Kelas</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Contoh: 7A, 8B, 10 IPA 1"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.inputLabel}>Tingkat (Grade)</Text>
            <View style={styles.gradeSelectRow}>
              {['7', '8', '9', '10', '11', '12'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[styles.gradeSelectChip, grade === g && styles.gradeSelectChipActive]}
                  onPress={() => setGrade(g)}
                >
                  <Text
                    style={[
                      styles.gradeSelectText,
                      grade === g && styles.gradeSelectTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Tahun Ajaran</Text>
            <View style={styles.optionsWrap}>
              {academicYears.map((ay) => (
                <TouchableOpacity
                  key={ay.id}
                  style={[styles.optionChip, academicYearId === ay.id && styles.optionChipActive]}
                  onPress={() => setAcademicYearId(ay.id)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      academicYearId === ay.id && styles.optionChipTextActive,
                    ]}
                  >
                    {ay.name} {ay.isActive ? '(Aktif)' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Wali Kelas (Opsional)</Text>
            <View style={styles.optionsWrap}>
              <TouchableOpacity
                style={[styles.optionChip, homeroomTeacherId === null && styles.optionChipActive]}
                onPress={() => setHomeroomTeacherId(null)}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    homeroomTeacherId === null && styles.optionChipTextActive,
                  ]}
                >
                  Belum Ditentukan
                </Text>
              </TouchableOpacity>
              {teachers.slice(0, 10).map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.optionChip,
                    homeroomTeacherId === t.id && styles.optionChipActive,
                  ]}
                  onPress={() => setHomeroomTeacherId(t.id)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      homeroomTeacherId === t.id && styles.optionChipTextActive,
                    ]}
                  >
                    {t.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setIsActive(!isActive)}
            >
              <Ionicons
                name={isActive ? 'checkbox' : 'square-outline'}
                size={22}
                color={isActive ? Colors.primary : Colors.textMuted}
              />
              <Text style={styles.checkboxLabel}>Kelas Aktif</Text>
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
  gradeFilterRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  gradeChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  gradeChipActive: {
    backgroundColor: Colors.primary,
  },
  gradeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  gradeChipTextActive: {
    color: '#FFFFFF',
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nameBlock: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  className: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  gradeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  gradeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  academicYearText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    padding: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  metaBold: {
    fontWeight: '600',
    color: Colors.text,
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
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  studentBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginLeft: 4,
  },
  viewDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 2,
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
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '90%',
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
  gradeSelectRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  gradeSelectChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  gradeSelectChipActive: {
    backgroundColor: Colors.primary,
  },
  gradeSelectText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  gradeSelectTextActive: {
    color: '#FFFFFF',
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
    maxHeight: 90,
  },
  optionChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  optionChipActive: {
    backgroundColor: Colors.primary,
  },
  optionChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  optionChipTextActive: {
    color: '#FFFFFF',
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
