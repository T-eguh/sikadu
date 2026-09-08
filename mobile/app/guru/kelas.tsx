import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../components/SafeScreen';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { Colors } from '../../constants/colors';
import { AcademicService } from '../../services/academicService';
import { TeacherClassItem } from '../../types/academic';

export default function TeacherKelasScreen() {
  useProtectedRoute(['TEACHER']);

  const [classes, setClasses] = useState<TeacherClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Detail Modal for Guru
  const [selectedClass, setSelectedClass] = useState<TeacherClassItem | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const res = await AcademicService.getTeacherMyClasses();
      setClasses(res);
    } catch (e) {
      // ignore
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

  const openClassDetail = (item: TeacherClassItem) => {
    setSelectedClass(item);
    setDetailModalVisible(true);
  };

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header title="Kelas Saya" subtitle="Penugasan Mengajar Aktif" />

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.secondary} />
          <Text style={styles.loadingText}>Memuat daftar kelas mengajar...</Text>
        </View>
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.secondary]} />
          }
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>
              Daftar Kelas yang Diampu ({classes.length})
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="bookmarks-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>Belum Ada Penugasan Kelas</Text>
              <Text style={styles.emptySub}>
                Administrator sekolah belum menambahkan penugasan mengajar untuk akun Anda.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openClassDetail(item)}
            >
              <Card style={styles.classCard}>
                <View style={styles.classRow}>
                  <View style={styles.iconBox}>
                    <Ionicons name="book" size={24} color={Colors.secondary} />
                  </View>
                  <View style={styles.classDetails}>
                    <View style={styles.subjectRow}>
                      <Text style={styles.subjectName}>{item.subjectName}</Text>
                      <View style={styles.codeBadge}>
                        <Text style={styles.codeText}>{item.subjectCode}</Text>
                      </View>
                    </View>
                    <Text style={styles.className}>
                      Kelas {item.className} (Tingkat {item.grade})
                    </Text>
                    <View style={styles.metaRow}>
                      <Ionicons name="calendar-outline" size={12} color={Colors.textMuted} />
                      <Text style={styles.academicYearText}>TA: {item.academicYearName}</Text>
                      <Text style={styles.dotSeparator}>•</Text>
                      <Ionicons name="people-outline" size={12} color={Colors.secondary} />
                      <Text style={styles.classStudents}>{item.totalStudents} Siswa</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                </View>
              </Card>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <View style={styles.noticeBox}>
              <Ionicons name="information-circle-outline" size={18} color={Colors.secondary} />
              <Text style={styles.noticeText}>
                Daftar kelas ditampilkan berdasarkan Penugasan Mengajar aktif dari sistem akademik sekolah.
              </Text>
            </View>
          }
        />
      )}

      {/* Modal Detail Kelas Guru (Read-Only) */}
      <Modal visible={detailModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {selectedClass && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Kelas {selectedClass.className}</Text>
                    <Text style={styles.modalSub}>
                      {selectedClass.subjectName} ({selectedClass.subjectCode}) • TA:{' '}
                      {selectedClass.academicYearName}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                    <Ionicons name="close" size={24} color={Colors.textMuted} />
                  </TouchableOpacity>
                </View>

                <View style={styles.readOnlyNotice}>
                  <Ionicons name="eye-outline" size={16} color={Colors.secondary} />
                  <Text style={styles.readOnlyText}>
                    Mode Lihat Siswa (Read-Only) — Pengelolaan siswa diatur oleh Administrator.
                  </Text>
                </View>

                <Text style={styles.studentListHeader}>
                  Daftar Siswa ({selectedClass.students.length} Siswa)
                </Text>

                <FlatList
                  data={selectedClass.students}
                  keyExtractor={(s) => s.id}
                  style={styles.studentModalList}
                  ListEmptyComponent={
                    <View style={styles.emptyBox}>
                      <Text style={styles.emptySub}>Belum ada siswa di kelas ini.</Text>
                    </View>
                  }
                  renderItem={({ item, index }) => (
                    <View style={styles.studentItemRow}>
                      <View style={styles.studentNumberBadge}>
                        <Text style={styles.studentNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.studentItemInfo}>
                        <Text style={styles.studentItemName}>{item.name}</Text>
                        <Text style={styles.studentItemMeta}>
                          NIS: {item.studentNumber} • NISN: {item.nisn}
                        </Text>
                      </View>
                    </View>
                  )}
                />

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Text style={styles.closeBtnText}>Tutup</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  classCard: {
    padding: 16,
    marginBottom: 12,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  classDetails: {
    flex: 1,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  codeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  codeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
  },
  className: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  academicYearText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  dotSeparator: {
    fontSize: 11,
    color: Colors.textMuted,
    marginHorizontal: 6,
  },
  classStudents: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '700',
    marginLeft: 4,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  noticeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
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
    lineHeight: 18,
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
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  modalSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  readOnlyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  readOnlyText: {
    fontSize: 11,
    color: Colors.secondary,
    marginLeft: 6,
    flex: 1,
  },
  studentListHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  studentModalList: {
    maxHeight: 280,
  },
  studentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  studentNumberBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  studentNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  studentItemInfo: {
    flex: 1,
  },
  studentItemName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  studentItemMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  closeBtn: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
});
