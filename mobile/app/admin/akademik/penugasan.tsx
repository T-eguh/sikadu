import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
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
import {
  TeachingAssignmentItem,
  ClassItem,
  SubjectItem,
  AcademicYearItem,
} from '../../../types/academic';
import { TeacherItem } from '../../../types/userManagement';

export default function PenugasanMengajarScreen() {
  useProtectedRoute(['ADMIN']);
  const router = useRouter();

  const [assignments, setAssignments] = useState<TeachingAssignmentItem[]>([]);
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYearItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Add Assignment Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTeacherId, setSelectedTeacherId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedAcademicYearId, setSelectedAcademicYearId] = useState('');
  const [formError, setFormError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [assRes, teachRes, classRes, subjRes, ayRes] = await Promise.all([
        AcademicService.getTeachingAssignments(1, 100),
        TeacherService.getTeachers(1, 100),
        AcademicService.getClasses(1, 100),
        AcademicService.getSubjects(1, 100),
        AcademicService.getAcademicYears(),
      ]);

      setAssignments(assRes.data);
      setTeachers(teachRes.data.filter((t) => t.isActive));
      setClasses(classRes.data.filter((c) => c.isActive));
      setSubjects(subjRes.data.filter((s) => s.isActive));
      setAcademicYears(ayRes.data);

      const activeAy = ayRes.data.find((y: any) => y.isActive);
      if (activeAy && !selectedAcademicYearId) {
        setSelectedAcademicYearId(activeAy.id);
      }
    } catch (e: any) {
      Alert.alert('Gagal Memuat Data', e.response?.data?.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedAcademicYearId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const openCreateModal = () => {
    setSelectedTeacherId(teachers[0]?.id || '');
    setSelectedClassId(classes[0]?.id || '');
    setSelectedSubjectId(subjects[0]?.id || '');
    const activeAy = academicYears.find((y) => y.isActive);
    setSelectedAcademicYearId(activeAy ? activeAy.id : academicYears[0]?.id || '');
    setFormError('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!selectedTeacherId || !selectedClassId || !selectedSubjectId || !selectedAcademicYearId) {
      setFormError('Semua bidang (Guru, Kelas, Mapel, Tahun Ajaran) wajib dipilih.');
      return;
    }

    try {
      setActionLoading(true);
      setFormError('');
      await AcademicService.createTeachingAssignment({
        teacherId: selectedTeacherId,
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        academicYearId: selectedAcademicYearId,
      });
      Alert.alert('Sukses', 'Penugasan mengajar berhasil disimpan.');
      setModalVisible(false);
      loadData();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Gagal menyimpan penugasan mengajar.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (item: TeachingAssignmentItem) => {
    Alert.alert(
      'Hapus Penugasan',
      `Hapus penugasan ${item.teacher.user.name} untuk mapel ${item.subject.name} di kelas ${item.class.name}?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              await AcademicService.deleteTeachingAssignment(item.id);
              Alert.alert('Sukses', 'Penugasan mengajar berhasil dihapus.');
              loadData();
            } catch (err: any) {
              Alert.alert('Gagal', err.response?.data?.message || 'Gagal menghapus data.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeScreen backgroundColor={Colors.background}>
      {/* Top Bar Navigation */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.topBarTitles}>
          <Text style={styles.topBarTitle}>Penugasan Mengajar</Text>
          <Text style={styles.topBarSubtitle}>Distribusi Guru per Mata Pelajaran</Text>
        </View>
        <TouchableOpacity style={styles.addHeaderBtn} onPress={openCreateModal}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat penugasan mengajar...</Text>
        </View>
      ) : (
        <FlatList
          data={assignments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="git-branch-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Belum Ada Penugasan</Text>
              <Text style={styles.emptySub}>
                Tekan tombol + di atas untuk menugaskan guru ke kelas dan mata pelajaran.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Card style={styles.itemCard}>
              <View style={styles.cardHeader}>
                <View style={styles.headerTitles}>
                  <Text style={styles.subjectName}>{item.subject.name}</Text>
                  <View style={styles.badgeRow}>
                    <View style={styles.codeBadge}>
                      <Text style={styles.codeText}>{item.subject.code}</Text>
                    </View>
                    <View style={styles.classBadge}>
                      <Text style={styles.classBadgeText}>Kelas {item.class.name}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => handleDelete(item)}
                  disabled={actionLoading}
                >
                  <Ionicons name="trash-outline" size={18} color={Colors.error} />
                </TouchableOpacity>
              </View>

              {/* Teacher row */}
              <View style={styles.teacherRow}>
                <View style={styles.teacherAvatar}>
                  <Ionicons name="person" size={16} color="#FFFFFF" />
                </View>
                <View style={styles.teacherTextContainer}>
                  <Text style={styles.teacherName}>{item.teacher.user.name}</Text>
                  <Text style={styles.teacherEmail}>{item.teacher.user.email}</Text>
                </View>
              </View>

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.academicYearRow}>
                  <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.academicYearText}>
                    TA: {item.academicYear.name}
                  </Text>
                </View>
                <Text style={styles.studentsInClassText}>
                  {item.class._count?.students ?? 0} Siswa di Kelas
                </Text>
              </View>
            </Card>
          )}
        />
      )}

      {/* Modal Tambah Penugasan Mengajar */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tugaskan Guru ke Kelas</Text>
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

            {/* Select Teacher */}
            <Text style={styles.inputLabel}>Pilih Guru Pengampu</Text>
            <View style={styles.optionsWrap}>
              {teachers.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  style={[
                    styles.optionChip,
                    selectedTeacherId === t.id && styles.optionChipActive,
                  ]}
                  onPress={() => setSelectedTeacherId(t.id)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      selectedTeacherId === t.id && styles.optionChipTextActive,
                    ]}
                  >
                    {t.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Select Class */}
            <Text style={styles.inputLabel}>Pilih Kelas</Text>
            <View style={styles.optionsWrap}>
              {classes.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.optionChip, selectedClassId === c.id && styles.optionChipActive]}
                  onPress={() => setSelectedClassId(c.id)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      selectedClassId === c.id && styles.optionChipTextActive,
                    ]}
                  >
                    Kelas {c.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Select Subject */}
            <Text style={styles.inputLabel}>Pilih Mata Pelajaran</Text>
            <View style={styles.optionsWrap}>
              {subjects.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.optionChip, selectedSubjectId === s.id && styles.optionChipActive]}
                  onPress={() => setSelectedSubjectId(s.id)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      selectedSubjectId === s.id && styles.optionChipTextActive,
                    ]}
                  >
                    {s.name} ({s.code})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Select Academic Year */}
            <Text style={styles.inputLabel}>Tahun Ajaran</Text>
            <View style={styles.optionsWrap}>
              {academicYears.map((ay) => (
                <TouchableOpacity
                  key={ay.id}
                  style={[
                    styles.optionChip,
                    selectedAcademicYearId === ay.id && styles.optionChipActive,
                  ]}
                  onPress={() => setSelectedAcademicYearId(ay.id)}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      selectedAcademicYearId === ay.id && styles.optionChipTextActive,
                    ]}
                  >
                    {ay.name} {ay.isActive ? '(Aktif)' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

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
                  <Text style={styles.saveBtnText}>Simpan Penugasan</Text>
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
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerTitles: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  codeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  classBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  classBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  teacherAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  teacherTextContainer: {
    flex: 1,
  },
  teacherName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  teacherEmail: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  academicYearRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  academicYearText: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  studentsInClassText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
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
    marginBottom: 6,
    marginTop: 8,
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
    minWidth: 130,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
