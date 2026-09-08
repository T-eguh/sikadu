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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../../components/SafeScreen';
import { Card } from '../../../components/Card';
import { useProtectedRoute } from '../../../hooks/useProtectedRoute';
import { Colors } from '../../../constants/colors';
import { AcademicService } from '../../../services/academicService';
import { StudentService } from '../../../services/studentService';
import { ClassItem } from '../../../types/academic';
import { StudentItem } from '../../../types/userManagement';

export default function ClassDetailScreen() {
  useProtectedRoute(['ADMIN']);
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [classDetail, setClassDetail] = useState<ClassItem | null>(null);
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>('students');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Add Students Multi-Select Modal
  const [addStudentModalVisible, setAddStudentModalVisible] = useState(false);
  const [allStudents, setAllStudents] = useState<StudentItem[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState('');
  const [addStudentError, setAddStudentError] = useState('');

  // Move Student Modal
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [studentToMove, setStudentToMove] = useState<any | null>(null);
  const [availableTargetClasses, setAvailableTargetClasses] = useState<ClassItem[]>([]);
  const [targetClassId, setTargetClassId] = useState('');
  const [moveError, setMoveError] = useState('');

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const cls = await AcademicService.getClassById(id);
      setClassDetail(cls);
    } catch (e: any) {
      Alert.alert('Gagal Memuat Detail', e.response?.data?.message || 'Kelas tidak ditemukan.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Open Add Student Modal
  const openAddStudentModal = async () => {
    try {
      setActionLoading(true);
      const res = await StudentService.getStudents(1, 100);
      // Filter out students already in this class
      const currentIds = new Set((classDetail?.students || []).map((cs: any) => cs.student.id));
      const candidates = res.data.filter((s) => !currentIds.has(s.id) && s.isActive);
      setAllStudents(candidates);
      setSelectedStudentIds([]);
      setStudentSearch('');
      setAddStudentError('');
      setAddStudentModalVisible(true);
    } catch (err: any) {
      Alert.alert('Gagal', 'Tidak dapat mengambil daftar siswa.');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((s) => s !== studentId) : [...prev, studentId]
    );
  };

  const handleSaveAddStudents = async () => {
    if (selectedStudentIds.length === 0) {
      setAddStudentError('Pilih minimal satu siswa.');
      return;
    }

    try {
      setActionLoading(true);
      setAddStudentError('');
      await AcademicService.addStudentsToClass(id!, selectedStudentIds);
      Alert.alert('Sukses', `${selectedStudentIds.length} siswa berhasil dimasukkan ke kelas.`);
      setAddStudentModalVisible(false);
      loadData();
    } catch (err: any) {
      setAddStudentError(err.response?.data?.message || 'Gagal menambahkan siswa ke kelas.');
    } finally {
      setActionLoading(false);
    }
  };

  // Remove Student Handler
  const handleRemoveStudent = (studentId: string, studentName: string) => {
    Alert.alert(
      'Keluarkan Siswa',
      `Apakah Anda yakin ingin mengeluarkan ${studentName} dari kelas ini?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluarkan',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionLoading(true);
              await AcademicService.removeStudentFromClass(id!, studentId);
              Alert.alert('Sukses', 'Siswa berhasil dikeluarkan dari kelas.');
              loadData();
            } catch (err: any) {
              Alert.alert('Gagal', err.response?.data?.message || 'Gagal mengeluarkan siswa.');
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  };

  // Open Move Student Modal
  const openMoveModal = async (cs: any) => {
    try {
      setActionLoading(true);
      setStudentToMove(cs);
      const classesRes = await AcademicService.getClasses(1, 100);
      // Filter out current class, match same academic year
      const otherClasses = classesRes.data.filter(
        (c) => c.id !== id && c.academicYearId === classDetail?.academicYearId && c.isActive
      );
      setAvailableTargetClasses(otherClasses);
      setTargetClassId(otherClasses[0]?.id || '');
      setMoveError('');
      setMoveModalVisible(true);
    } catch (err: any) {
      Alert.alert('Gagal', 'Tidak dapat memuat daftar kelas tujuan.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveMoveStudent = async () => {
    if (!targetClassId) {
      setMoveError('Pilih kelas tujuan pemindahan.');
      return;
    }

    try {
      setActionLoading(true);
      setMoveError('');
      await AcademicService.moveStudent(id!, targetClassId, studentToMove.student.id);
      Alert.alert('Sukses', 'Siswa berhasil dipindahkan ke kelas tujuan.');
      setMoveModalVisible(false);
      loadData();
    } catch (err: any) {
      setMoveError(err.response?.data?.message || 'Gagal memindahkan siswa.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeScreen backgroundColor={Colors.background}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat detail kelas...</Text>
        </View>
      </SafeScreen>
    );
  }

  if (!classDetail) {
    return (
      <SafeScreen backgroundColor={Colors.background}>
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Detail Kelas</Text>
        </View>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Kelas tidak ditemukan</Text>
        </View>
      </SafeScreen>
    );
  }

  const filteredCandidateStudents = allStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentNumber.toLowerCase().includes(studentSearch.toLowerCase())
  );

  return (
    <SafeScreen backgroundColor={Colors.background}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.topBarTitles}>
          <Text style={styles.topBarTitle}>Kelas {classDetail.name}</Text>
          <Text style={styles.topBarSubtitle}>
            Tingkat {classDetail.grade} • TA: {classDetail.academicYear?.name || '-'}
          </Text>
        </View>
      </View>

      {/* Class Information Banner */}
      <View style={styles.headerBanner}>
        <View style={styles.headerInfoRow}>
          <View style={styles.classIconBox}>
            <Ionicons name="easel" size={28} color={Colors.primary} />
          </View>
          <View style={styles.headerTexts}>
            <View style={styles.titleWithStatus}>
              <Text style={styles.bannerClassName}>Kelas {classDetail.name}</Text>
              <View
                style={[
                  styles.statusBadge,
                  classDetail.isActive ? styles.statusActive : styles.statusInactive,
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    classDetail.isActive ? styles.statusActiveText : styles.statusInactiveText,
                  ]}
                >
                  {classDetail.isActive ? 'Aktif' : 'Nonaktif'}
                </Text>
              </View>
            </View>
            <Text style={styles.bannerWali}>
              Wali Kelas:{' '}
              <Text style={styles.bannerWaliBold}>
                {classDetail.homeroomTeacher ? classDetail.homeroomTeacher.user.name : 'Belum Ditentukan'}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.counterRow}>
          <View style={styles.counterItem}>
            <Text style={styles.counterNumber}>
              {classDetail.students?.length ?? classDetail._count?.students ?? 0}
            </Text>
            <Text style={styles.counterLabel}>Total Siswa</Text>
          </View>
          <View style={styles.counterDivider} />
          <View style={styles.counterItem}>
            <Text style={styles.counterNumber}>
              {classDetail.teachingAssignments?.length ?? classDetail._count?.teachingAssignments ?? 0}
            </Text>
            <Text style={styles.counterLabel}>Mata Pelajaran</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'students' && styles.tabBtnActive]}
          onPress={() => setActiveTab('students')}
        >
          <Ionicons
            name="people"
            size={18}
            color={activeTab === 'students' ? Colors.primary : Colors.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'students' && styles.tabTextActive]}>
            Daftar Siswa ({classDetail.students?.length || 0})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'teachers' && styles.tabBtnActive]}
          onPress={() => setActiveTab('teachers')}
        >
          <Ionicons
            name="book"
            size={18}
            color={activeTab === 'teachers' ? Colors.primary : Colors.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'teachers' && styles.tabTextActive]}>
            Guru & Mapel ({classDetail.teachingAssignments?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {activeTab === 'students' ? (
        <View style={styles.tabContent}>
          <View style={styles.actionHeaderRow}>
            <Text style={styles.tabSectionTitle}>Siswa Terdaftar</Text>
            <TouchableOpacity
              style={styles.addStudentBtn}
              onPress={openAddStudentModal}
              disabled={actionLoading}
            >
              <Ionicons name="person-add" size={16} color="#FFFFFF" />
              <Text style={styles.addStudentBtnText}>Tambah Siswa</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={classDetail.students || []}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
            }
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Ionicons name="people-outline" size={44} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>Belum Ada Siswa di Kelas Ini</Text>
                <Text style={styles.emptySub}>
                  Klik tombol "+ Tambah Siswa" untuk memasukkan siswa ke dalam kelas.
                </Text>
              </View>
            }
            renderItem={({ item, index }) => (
              <Card style={styles.studentCard}>
                <View style={styles.studentRow}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                  </View>

                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{item.student.user.name}</Text>
                    <Text style={styles.studentMeta}>
                      NIS: {item.student.studentNumber} • NISN: {item.student.nisn}
                    </Text>
                  </View>

                  <View style={styles.studentActions}>
                    <TouchableOpacity
                      style={styles.moveBtn}
                      onPress={() => openMoveModal(item)}
                      title="Pindahkan Kelas"
                    >
                      <Ionicons name="swap-horizontal" size={18} color={Colors.primary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() =>
                        handleRemoveStudent(item.student.id, item.student.user.name)
                      }
                      title="Keluarkan"
                    >
                      <Ionicons name="trash-outline" size={18} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card>
            )}
          />
        </View>
      ) : (
        <View style={styles.tabContent}>
          <Text style={styles.tabSectionTitle}>Penugasan Guru di Kelas Ini</Text>
          <FlatList
            data={classDetail.teachingAssignments || []}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
            }
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Ionicons name="school-outline" size={44} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>Belum Ada Penugasan Guru</Text>
                <Text style={styles.emptySub}>
                  Silakan tambahkan penugasan guru di menu Penugasan Mengajar.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <Card style={styles.teacherCard}>
                <View style={styles.teacherRow}>
                  <View style={styles.subjectIconBox}>
                    <Ionicons name="book" size={20} color="#10B981" />
                  </View>
                  <View style={styles.teacherInfo}>
                    <Text style={styles.subjectTitle}>{item.subject.name}</Text>
                    <Text style={styles.subjectCode}>{item.subject.code}</Text>
                    <Text style={styles.teacherNameText}>
                      Pengampu:{' '}
                      <Text style={styles.teacherNameBold}>{item.teacher.user.name}</Text>
                    </Text>
                  </View>
                </View>
              </Card>
            )}
          />
        </View>
      )}

      {/* Modal Tambah Siswa ke Kelas (Multi-Select) */}
      <Modal visible={addStudentModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.multiSelectModal}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Tambah Siswa ke Kelas</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedStudentIds.length} siswa dipilih
                </Text>
              </View>
              <TouchableOpacity onPress={() => setAddStudentModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {addStudentError ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{addStudentError}</Text>
              </View>
            ) : null}

            {/* Search candidate students */}
            <View style={styles.modalSearchBar}>
              <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
              <TextInput
                style={styles.modalSearchInput}
                placeholder="Cari nama / NIS siswa..."
                placeholderTextColor={Colors.textMuted}
                value={studentSearch}
                onChangeText={setStudentSearch}
              />
            </View>

            <FlatList
              data={filteredCandidateStudents}
              keyExtractor={(s) => s.id}
              style={styles.candidateList}
              ListEmptyComponent={
                <View style={styles.emptyBox}>
                  <Text style={styles.emptySub}>
                    {allStudents.length === 0
                      ? 'Semua siswa aktif sudah terdaftar di kelas.'
                      : 'Tidak ditemukan siswa yang cocok.'}
                  </Text>
                </View>
              }
              renderItem={({ item }) => {
                const isChecked = selectedStudentIds.includes(item.id);
                return (
                  <TouchableOpacity
                    style={[styles.candidateItem, isChecked && styles.candidateItemChecked]}
                    onPress={() => toggleStudentSelection(item.id)}
                  >
                    <Ionicons
                      name={isChecked ? 'checkbox' : 'square-outline'}
                      size={22}
                      color={isChecked ? Colors.primary : Colors.textMuted}
                    />
                    <View style={styles.candidateInfo}>
                      <Text style={styles.candidateName}>{item.name}</Text>
                      <Text style={styles.candidateMeta}>
                        NIS: {item.studentNumber} • NISN: {item.nisn}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setAddStudentModalVisible(false)}
                disabled={actionLoading}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveAddStudents}
                disabled={actionLoading || selectedStudentIds.length === 0}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>
                    Tambahkan ({selectedStudentIds.length})
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Pindahkan Siswa */}
      <Modal visible={moveModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pindahkan Siswa</Text>
              <TouchableOpacity onPress={() => setMoveModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>

            {moveError ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{moveError}</Text>
              </View>
            ) : null}

            {studentToMove && (
              <View style={styles.moveTargetInfo}>
                <Text style={styles.moveStudentName}>
                  {studentToMove.student.user.name}
                </Text>
                <Text style={styles.moveStudentMeta}>
                  Kelas saat ini: Kelas {classDetail.name} (Tingkat {classDetail.grade})
                </Text>
              </View>
            )}

            <Text style={styles.inputLabel}>Pilih Kelas Tujuan:</Text>
            <View style={styles.optionsWrap}>
              {availableTargetClasses.length === 0 ? (
                <Text style={styles.noTargetText}>
                  Tidak ada kelas lain yang aktif pada tahun ajaran ini.
                </Text>
              ) : (
                availableTargetClasses.map((tc) => (
                  <TouchableOpacity
                    key={tc.id}
                    style={[
                      styles.targetClassChip,
                      targetClassId === tc.id && styles.targetClassChipActive,
                    ]}
                    onPress={() => setTargetClassId(tc.id)}
                  >
                    <Text
                      style={[
                        styles.targetClassText,
                        targetClassId === tc.id && styles.targetClassTextActive,
                      ]}
                    >
                      Kelas {tc.name} (Tingkat {tc.grade})
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setMoveModalVisible(false)}
                disabled={actionLoading}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveMoveStudent}
                disabled={actionLoading || !targetClassId}
              >
                {actionLoading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Pindahkan</Text>
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
  headerBanner: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classIconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerTexts: {
    flex: 1,
  },
  titleWithStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerClassName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 10,
  },
  statusActive: {
    backgroundColor: '#ECFDF5',
  },
  statusActiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  statusInactive: {
    backgroundColor: '#F1F5F9',
  },
  statusInactiveText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  bannerWali: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  bannerWaliBold: {
    fontWeight: '700',
    color: Colors.text,
  },
  counterRow: {
    flexDirection: 'row',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  counterItem: {
    flex: 1,
    alignItems: 'center',
  },
  counterDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F1F5F9',
  },
  counterNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  counterLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    gap: 6,
  },
  tabBtnActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  actionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tabSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  addStudentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addStudentBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  studentCard: {
    padding: 12,
    marginBottom: 8,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  studentMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  studentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moveBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teacherCard: {
    padding: 14,
    marginBottom: 10,
  },
  teacherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teacherInfo: {
    flex: 1,
  },
  subjectTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  subjectCode: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    marginTop: 1,
  },
  teacherNameText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  teacherNameBold: {
    fontWeight: '700',
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
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  // Modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  multiSelectModal: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  modalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 10,
  },
  modalSearchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 13,
    color: Colors.text,
  },
  candidateList: {
    maxHeight: 280,
  },
  candidateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  candidateItemChecked: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  candidateInfo: {
    marginLeft: 10,
    flex: 1,
  },
  candidateName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  candidateMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  moveTargetInfo: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  moveStudentName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  moveStudentMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  optionsWrap: {
    gap: 8,
  },
  targetClassChip: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  targetClassChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: Colors.primary,
  },
  targetClassText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  targetClassTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  noTargetText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
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
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    minWidth: 100,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
