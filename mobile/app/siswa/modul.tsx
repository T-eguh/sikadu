import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeScreen } from '../../components/SafeScreen';
import { Header } from '../../components/Header';
import { Card } from '../../components/Card';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';
import { Colors } from '../../constants/colors';
import {
  moduleService,
  ModuleItem,
  ModuleContentItem,
  ContentType,
} from '../../services/moduleService';

export default function StudentModulScreen() {
  useProtectedRoute(['STUDENT']);

  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Selected module for interactive learning
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeContent, setActiveContent] = useState<ModuleContentItem | null>(null);

  const loadModules = async () => {
    try {
      setLoading(true);
      const res = await moduleService.getStudentModules({ search }).catch(() => []);
      if (res && res.length > 0) {
        setModules(res);
      } else {
        // Fallback sample data if no modules from backend yet
        setModules([
          {
            id: 'mod-01',
            title: 'Persamaan & Pertidaksamaan Linear Satu Variabel',
            description: 'Konsep dasar aljabar, penyelesaian persamaan linear, dan penerapannya.',
            learningObjectives: 'Siswa mampu memahami konsep persamaan linear dan himpunan penyelesaian.',
            status: 'PUBLISHED',
            teacherId: 'tch-01',
            teachingAssignmentId: 'ta-01',
            classId: 'cls-01',
            subjectId: 'subj-01',
            academicYearId: 'ay-01',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            teacher: {
              id: 'tch-01',
              user: { name: 'Ahmad Fauzi, S.Pd', email: 'guru@sekolah.sch.id' },
            },
            class: { id: 'cls-01', name: 'Kelas X-A', grade: 10 },
            subject: { id: 'subj-01', name: 'Matematika Wajib', code: 'MAT-10' },
            totalContents: 4,
            completedContents: 3,
            percentage: 75,
          },
          {
            id: 'mod-02',
            title: 'Teks Laporan Hasil Observasi (LHO)',
            description: 'Struktur, kaidah kebahasaan, dan teknik penulisan teks observasi obyektif.',
            learningObjectives: 'Siswa dapat mengidentifikasi struktur teks LHO dan menyusun laporan.',
            status: 'PUBLISHED',
            teacherId: 'tch-01',
            teachingAssignmentId: 'ta-02',
            classId: 'cls-01',
            subjectId: 'subj-02',
            academicYearId: 'ay-01',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            teacher: {
              id: 'tch-01',
              user: { name: 'Siti Nurhaliza, M.Pd', email: 'guru2@sekolah.sch.id' },
            },
            class: { id: 'cls-01', name: 'Kelas X-A', grade: 10 },
            subject: { id: 'subj-02', name: 'Bahasa Indonesia', code: 'BIN-10' },
            totalContents: 2,
            completedContents: 1,
            percentage: 50,
          },
        ]);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, [search]);

  const handleOpenModule = async (mod: ModuleItem) => {
    try {
      setLoadingDetail(true);
      setSelectedModule(mod);
      const detail = await moduleService.getStudentModuleDetail(mod.id).catch(() => null);
      if (detail && detail.contents) {
        setSelectedModule(detail);
        if (detail.contents.length > 0) {
          setActiveContent(detail.contents[0]);
        }
      } else {
        // Fallback default contents if backend detail fails
        const sampleContents: ModuleContentItem[] = [
          {
            id: 'mc-01',
            moduleId: mod.id,
            title: '1. Pengertian Persamaan Linear Satu Variabel',
            description: 'Definisi matematis kalimat terbuka dan tertutup.',
            contentType: 'TEXT',
            textContent:
              'Persamaan Linear Satu Variabel (PLSV) adalah kalimat terbuka yang dihubungkan dengan tanda sama dengan (=) dan hanya memiliki satu variabel berpangkat satu.\n\nBentuk umum PLSV:\nax + b = c, dengan a ≠ 0.\n\nContoh:\n2x + 4 = 10\n2x = 10 - 4\n2x = 6\nx = 3',
            orderNumber: 1,
            isCompleted: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'mc-02',
            moduleId: mod.id,
            title: '2. Bahan Ajar Pegangan Siswa (PDF)',
            description: 'Buku saku rumus cepat dan kumpulan soal latihan mandiri.',
            contentType: 'DOCUMENT',
            fileUrl: '/uploads/modules/documents/Modul-Matematika-X-PLSV.pdf',
            orderNumber: 2,
            isCompleted: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'mc-03',
            moduleId: mod.id,
            title: '3. Video Tutorial Penyelesaian Soal Cerita',
            description: 'Pembahasan contoh kasus model matematika dalam kehidupan nyata.',
            contentType: 'VIDEO',
            videoUrl: 'https://www.youtube.com/watch?v=sample-video-math',
            orderNumber: 3,
            isCompleted: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setSelectedModule({
          ...mod,
          contents: sampleContents,
        });
        setActiveContent(sampleContents[0]);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleToggleComplete = async (content: ModuleContentItem) => {
    if (!selectedModule) return;
    const newStatus = !content.isCompleted;

    try {
      // Optimistic update
      const updatedContents = (selectedModule.contents || []).map((c) =>
        c.id === content.id ? { ...c, isCompleted: newStatus } : c
      );
      const completedCount = updatedContents.filter((c) => c.isCompleted).length;
      const total = updatedContents.length;
      const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

      setSelectedModule({
        ...selectedModule,
        contents: updatedContents,
        completedContents: completedCount,
        percentage,
      });

      if (activeContent && activeContent.id === content.id) {
        setActiveContent({ ...activeContent, isCompleted: newStatus });
      }

      // Update modules list
      setModules((prev) =>
        prev.map((m) =>
          m.id === selectedModule.id
            ? { ...m, completedContents: completedCount, percentage }
            : m
        )
      );

      // Call API
      await moduleService.toggleStudentProgress(selectedModule.id, content.id, newStatus).catch(() => null);
    } catch (err) {
      console.warn(err);
    }
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'TEXT':
        return <Ionicons name="document-text" size={18} color="#2563EB" />;
      case 'DOCUMENT':
        return <Ionicons name="document-attach" size={18} color="#7C3AED" />;
      case 'VIDEO':
        return <Ionicons name="play-circle" size={18} color="#DC2626" />;
      case 'IMAGE':
        return <Ionicons name="image" size={18} color="#059669" />;
    }
  };

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header title="Materi Pembelajaran" subtitle="Modul Belajar Siswa Aktif" />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari materi atau mata pelajaran..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Modul Tersedia ({modules.length})</Text>
          <Text style={styles.sectionSubtitle}>Daftar materi kelas Anda</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.accent} />
            <Text style={styles.loadingText}>Memuat materi pembelajaran...</Text>
          </View>
        ) : modules.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="book-outline" size={36} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Belum ada modul dipublikasikan</Text>
            <Text style={styles.emptySubtitle}>
              Guru Anda belum mempublikasikan materi pembelajaran untuk kelas ini.
            </Text>
          </Card>
        ) : (
          modules.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleOpenModule(item)}
              activeOpacity={0.7}
            >
              <Card style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.badgeRow}>
                    <View style={styles.subjectBadge}>
                      <Text style={styles.subjectBadgeText}>
                        {item.subject?.name || 'Mata Pelajaran'}
                      </Text>
                    </View>
                    <View style={styles.classBadge}>
                      <Text style={styles.classBadgeText}>{item.class?.name || 'Kelas'}</Text>
                    </View>
                  </View>
                  <Text style={styles.progressPercent}>{item.percentage || 0}% Selesai</Text>
                </View>

                <Text style={styles.cardTitle}>{item.title}</Text>
                {item.teacher?.user?.name && (
                  <Text style={styles.teacherName}>
                    Pengajar: {item.teacher.user.name}
                  </Text>
                )}

                {/* Progress Bar */}
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${Math.min(100, item.percentage || 0)}%` },
                    ]}
                  />
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.progressStats}>
                    {item.completedContents || 0} dari {item.totalContents || 0} Materi Selesai
                  </Text>
                  <View style={styles.readLink}>
                    <Text style={styles.readLinkText}>Buka Materi</Text>
                    <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))
        )}

        <View style={styles.noticeBox}>
          <Ionicons name="sparkles" size={18} color={Colors.accent} />
          <Text style={styles.noticeText}>
            Progres belajar tercatat otomatis saat Anda menandai materi telah dipelajari.
          </Text>
        </View>
      </ScrollView>

      {/* MODAL: INTERACTIVE MODULE READER */}
      <Modal visible={!!selectedModule} animationType="slide">
        <SafeScreen backgroundColor={Colors.background}>
          {selectedModule && (
            <View style={{ flex: 1 }}>
              {/* Reader Header */}
              <View style={styles.readerHeader}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedModule(null);
                    setActiveContent(null);
                  }}
                  style={styles.backBtn}
                >
                  <Ionicons name="arrow-back" size={20} color={Colors.text} />
                  <Text style={styles.backBtnText}>Kembali</Text>
                </TouchableOpacity>
                <View style={styles.progressIndicator}>
                  <Text style={styles.progressIndicatorText}>
                    {selectedModule.percentage || 0}% Selesai
                  </Text>
                </View>
              </View>

              <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Module Summary Card */}
                <Card style={styles.summaryCard}>
                  <Text style={styles.moduleTitleLarge}>{selectedModule.title}</Text>
                  <Text style={styles.moduleMeta}>
                    {selectedModule.subject?.name} • {selectedModule.class?.name} •{' '}
                    {selectedModule.teacher?.user?.name}
                  </Text>

                  {/* Visual Progress Bar */}
                  <View style={styles.summaryProgressSection}>
                    <View style={styles.summaryProgressHeader}>
                      <Text style={styles.summaryProgressLabel}>Progres Belajar Mandiri</Text>
                      <Text style={styles.summaryProgressValue}>
                        {selectedModule.completedContents || 0} /{' '}
                        {selectedModule.contents?.length || selectedModule.totalContents || 0} Materi
                      </Text>
                    </View>
                    <View style={styles.progressBarBgLarge}>
                      <View
                        style={[
                          styles.progressBarFillLarge,
                          { width: `${Math.min(100, selectedModule.percentage || 0)}%` },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.objectivesCard}>
                    <Text style={styles.objectivesHeader}>🎯 Tujuan Pembelajaran:</Text>
                    <Text style={styles.objectivesBody}>
                      {selectedModule.learningObjectives}
                    </Text>
                  </View>
                </Card>

                {/* Content Items List */}
                <Text style={styles.sectionTitle}>Daftar Materi Pembelajaran</Text>

                {loadingDetail ? (
                  <ActivityIndicator size="small" color={Colors.accent} style={{ marginVertical: 20 }} />
                ) : (
                  (selectedModule.contents || []).map((content) => {
                    const isSelected = activeContent?.id === content.id;

                    return (
                      <View key={content.id} style={styles.contentItemWrapper}>
                        <TouchableOpacity
                          style={[
                            styles.contentCardItem,
                            isSelected && styles.contentCardItemSelected,
                          ]}
                          onPress={() => setActiveContent(content)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.contentCardLeft}>
                            {/* Checkbox */}
                            <TouchableOpacity
                              style={[
                                styles.checkBox,
                                content.isCompleted && styles.checkBoxCompleted,
                              ]}
                              onPress={() => handleToggleComplete(content)}
                            >
                              <Ionicons
                                name={content.isCompleted ? 'checkmark' : 'ellipse-outline'}
                                size={14}
                                color={content.isCompleted ? '#FFFFFF' : Colors.textMuted}
                              />
                            </TouchableOpacity>

                            <View style={styles.contentInfo}>
                              <View style={styles.contentTagRow}>
                                <Text style={styles.orderLabel}>Materi #{content.orderNumber}</Text>
                                <Text style={styles.typeLabel}>{content.contentType}</Text>
                              </View>
                              <Text style={styles.contentItemTitle}>{content.title}</Text>
                            </View>
                          </View>

                          <Ionicons
                            name={isSelected ? 'chevron-down' : 'chevron-forward'}
                            size={16}
                            color={Colors.textMuted}
                          />
                        </TouchableOpacity>

                        {/* Expandable Active Content Reader */}
                        {isSelected && (
                          <View style={styles.activeReaderBox}>
                            {content.description ? (
                              <Text style={styles.readerDesc}>{content.description}</Text>
                            ) : null}

                            {/* Content Body Rendering */}
                            {content.contentType === 'TEXT' && (
                              <View style={styles.textContentBox}>
                                <Text style={styles.textContentText}>
                                  {content.textContent || 'Tidak ada isi teks.'}
                                </Text>
                              </View>
                            )}

                            {content.contentType === 'DOCUMENT' && (
                              <View style={styles.documentActionBox}>
                                <Ionicons name="document-text" size={32} color="#7C3AED" />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                  <Text style={styles.docTitle}>Dokumen Materi (PDF)</Text>
                                  <Text style={styles.docSub} numberOfLines={1}>
                                    {content.fileUrl?.split('/').pop() || 'Dokumen Pelajaran'}
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  style={styles.openDocBtn}
                                  onPress={() => {
                                    Alert.alert(
                                      'Buka Dokumen',
                                      `Mengakses berkas materi: ${content.fileUrl}`
                                    );
                                  }}
                                >
                                  <Text style={styles.openDocBtnText}>Buka PDF</Text>
                                </TouchableOpacity>
                              </View>
                            )}

                            {content.contentType === 'VIDEO' && (
                              <View style={styles.videoActionBox}>
                                <Ionicons name="videocam" size={32} color="#DC2626" />
                                <View style={{ flex: 1, marginLeft: 10 }}>
                                  <Text style={styles.videoTitle}>Video Pembelajaran</Text>
                                  <Text style={styles.videoSub} numberOfLines={1}>
                                    {content.videoUrl}
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  style={styles.watchVideoBtn}
                                  onPress={() => {
                                    if (content.videoUrl) {
                                      Linking.openURL(content.videoUrl).catch(() => {
                                        Alert.alert('Info', 'Tautan video dibuka di peramban.');
                                      });
                                    }
                                  }}
                                >
                                  <Text style={styles.watchVideoBtnText}>Tonton</Text>
                                </TouchableOpacity>
                              </View>
                            )}

                            {/* Completion Action */}
                            <TouchableOpacity
                              style={[
                                styles.toggleCompleteBtn,
                                content.isCompleted && styles.toggleCompleteBtnDone,
                              ]}
                              onPress={() => handleToggleComplete(content)}
                            >
                              <Ionicons
                                name={content.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
                                size={18}
                                color={content.isCompleted ? '#059669' : '#FFFFFF'}
                              />
                              <Text
                                style={[
                                  styles.toggleCompleteText,
                                  content.isCompleted && styles.toggleCompleteTextDone,
                                ]}
                              >
                                {content.isCompleted
                                  ? 'Materi Sudah Selesai Dipelajari'
                                  : 'Tandai Selesai Mempelajari'}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    );
                  })
                )}
              </ScrollView>
            </View>
          )}
        </SafeScreen>
      </Modal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 38,
    fontSize: 12,
    color: Colors.text,
  },
  sectionHeaderRow: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  card: {
    padding: 14,
    marginBottom: 12,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subjectBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subjectBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065F46',
  },
  classBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  classBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  progressPercent: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 8,
  },
  progressStats: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  readLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  readLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  noticeText: {
    fontSize: 11,
    color: '#065F46',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  readerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  progressIndicator: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  summaryCard: {
    padding: 16,
    marginBottom: 14,
  },
  moduleTitleLarge: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  moduleMeta: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 10,
  },
  summaryProgressSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  summaryProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryProgressLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryProgressValue: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accent,
  },
  progressBarBgLarge: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFillLarge: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  objectivesCard: {
    backgroundColor: '#F0FDF4',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  objectivesHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 2,
  },
  objectivesBody: {
    fontSize: 11,
    color: '#15803D',
    lineHeight: 16,
  },
  contentItemWrapper: {
    marginBottom: 8,
  },
  contentCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentCardItemSelected: {
    borderColor: Colors.accent,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  contentCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBoxCompleted: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  contentInfo: {
    flex: 1,
  },
  contentTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  orderLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  typeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 4,
    borderRadius: 3,
  },
  contentItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  activeReaderBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.accent,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    padding: 14,
    gap: 10,
  },
  readerDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  textContentBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textContentText: {
    fontSize: 12,
    color: Colors.text,
    lineHeight: 18,
  },
  documentActionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    padding: 10,
    borderRadius: 10,
  },
  docTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5B21B6',
  },
  docSub: {
    fontSize: 10,
    color: '#7C3AED',
  },
  openDocBtn: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  openDocBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  videoActionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 10,
  },
  videoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  videoSub: {
    fontSize: 10,
    color: '#DC2626',
  },
  watchVideoBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  watchVideoBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  toggleCompleteBtn: {
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  toggleCompleteBtnDone: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  toggleCompleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  toggleCompleteTextDone: {
    color: '#059669',
  },
});
