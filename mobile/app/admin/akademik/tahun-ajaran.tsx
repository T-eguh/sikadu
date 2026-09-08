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
import { AcademicYearItem } from '../../../types/academic';

export default function TahunAjaranScreen() {
  useProtectedRoute(['ADMIN']);
  const router = useRouter();

  const [academicYears, setAcademicYears] = useState<AcademicYearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<AcademicYearItem | null>(null);
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const res = await AcademicService.getAcademicYears();
      setAcademicYears(res.data);
    } catch (e: any) {
      Alert.alert('Gagal Memuat Data', e.response?.data?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

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
    setStartDate(new Date().toISOString().split('T')[0]);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setEndDate(nextYear.toISOString().split('T')[0]);
    setIsActive(false);
    setFormError('');
    setModalVisible(true);
  };

  const openEditModal = (item: AcademicYearItem) => {
    setEditingItem(item);
    setName(item.name);
    setStartDate(new Date(item.startDate).toISOString().split('T')[0]);
    setEndDate(new Date(item.endDate).toISOString().split('T')[0]);
    setIsActive(item.isActive);
    setFormError('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setFormError('Nama Tahun Ajaran wajib diisi (contoh: 2026/2027)');
      return;
    }
    if (!startDate || !endDate) {
      setFormError('Tanggal mulai dan selesai wajib diisi');
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setFormError('Tanggal mulai harus lebih awal dari tanggal selesai');
      return;
    }

    try {
      setActionLoading(true);
      setFormError('');
      if (editingItem) {
        await AcademicService.updateAcademicYear(editingItem.id, {
          name: name.trim(),
          startDate,
          endDate,
          isActive,
        });
        Alert.alert('Sukses', 'Tahun ajaran berhasil diperbarui.');
      } else {
        await AcademicService.createAcademicYear({
          name: name.trim(),
          startDate,
          endDate,
          isActive,
        });
        Alert.alert('Sukses', 'Tahun ajaran baru berhasil dibuat.');
      }
      setModalVisible(false);
      loadData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan tahun ajaran.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = (item: AcademicYearItem) => {
    if (item.isActive) {
      Alert.alert(
        'Nonaktifkan Tahun Ajaran',
        `Apakah Anda yakin ingin menonaktifkan ${item.name}? Sistem tidak akan memiliki tahun ajaran aktif saat ini.`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Nonaktifkan',
            style: 'destructive',
            onPress: async () => {
              try {
                setActionLoading(true);
                await AcademicService.setAcademicYearStatus(item.id, false);
                loadData();
              } catch (e: any) {
                Alert.alert('Gagal', e.response?.data?.message || 'Gagal menonaktifkan status.');
              } finally {
                setActionLoading(false);
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Aktifkan Tahun Ajaran',
        `Mengaktifkan ${item.name} akan secara otomatis menonaktifkan tahun ajaran aktif lainnya melalui database transaction. Lanjutkan?`,
        [
          { text: 'Batal', style: 'cancel' },
          {
            text: 'Aktifkan',
            onPress: async () => {
              try {
                setActionLoading(true);
                await AcademicService.setAcademicYearStatus(item.id, true);
                loadData();
              } catch (e: any) {
                Alert.alert('Gagal', e.response?.data?.message || 'Gagal mengaktifkan tahun ajaran.');
              } finally {
                setActionLoading(false);
              }
            },
          },
        ]
      );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
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
          <Text style={styles.topBarTitle}>Tahun Ajaran</Text>
          <Text style={styles.topBarSubtitle}>Pengelolaan Periode Akademik</Text>
        </View>
        <TouchableOpacity style={styles.addHeaderBtn} onPress={openCreateModal}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat data tahun ajaran...</Text>
        </View>
      ) : (
        <FlatList
          data={academicYears}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="calendar-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Belum Ada Tahun Ajaran</Text>
              <Text style={styles.emptySub}>
                Tekan tombol + di atas untuk membuat tahun ajaran baru.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card style={[styles.itemCard, item.isActive && styles.activeItemCard]}>
              <View style={styles.cardHeader}>
                <View style={styles.nameContainer}>
                  <Text style={styles.yearName}>{item.name}</Text>
                  {item.isActive ? (
                    <View style={styles.activeBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                      <Text style={styles.activeBadgeText}>Tahun Ajaran Aktif</Text>
                    </View>
                  ) : (
                    <View style={styles.inactiveBadge}>
                      <Text style={styles.inactiveBadgeText}>Tidak Aktif</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => openEditModal(item)}
                >
                  <Ionicons name="create-outline" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.dateRow}>
                <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
                <Text style={styles.dateText}>
                  {formatDate(item.startDate)} s/d {formatDate(item.endDate)}
                </Text>
              </View>

              <View style={styles.cardFooter}>
                <View style={styles.statChip}>
                  <Text style={styles.statLabel}>Kelas: </Text>
                  <Text style={styles.statValue}>{item._count?.classes ?? 0}</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    item.isActive ? styles.btnDeactivate : styles.btnActivate,
                  ]}
                  onPress={() => handleToggleStatus(item)}
                  disabled={actionLoading}
                >
                  <Ionicons
                    name={item.isActive ? 'pause-circle-outline' : 'play-circle-outline'}
                    size={16}
                    color={item.isActive ? Colors.error : '#10B981'}
                  />
                  <Text
                    style={[
                      styles.actionBtnText,
                      item.isActive ? styles.btnDeactivateText : styles.btnActivateText,
                    ]}
                  >
                    {item.isActive ? 'Nonaktifkan' : 'Jadikan Aktif'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      )}

      {/* Modal Tambah / Edit Tahun Ajaran */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingItem ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran Baru'}
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

            <Text style={styles.inputLabel}>Nama Tahun Ajaran</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Contoh: 2026/2027 Ganjil"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.inputLabel}>Tanggal Mulai (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.textInput}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textMuted}
            />

            <Text style={styles.inputLabel}>Tanggal Selesai (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.textInput}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.textMuted}
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
              <Text style={styles.checkboxLabel}>
                Jadikan sebagai Tahun Ajaran Aktif
              </Text>
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
    borderLeftWidth: 4,
    borderLeftColor: Colors.border,
  },
  activeItemCard: {
    borderLeftColor: '#10B981',
    backgroundColor: '#FAFDFB',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  nameContainer: {
    flex: 1,
  },
  yearName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.text,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 4,
  },
  inactiveBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  inactiveBadgeText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnActivate: {
    backgroundColor: '#ECFDF5',
  },
  btnActivateText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  btnDeactivate: {
    backgroundColor: '#FEF2F2',
  },
  btnDeactivateText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  actionBtnText: {
    fontSize: 12,
  },
  // Modal Styles
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
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
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
