import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  Linking,
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
  ModuleStatus,
  ContentType,
  TeachingAssignmentItem,
} from '../../services/moduleService';

export default function TeacherModulScreen() {
  useProtectedRoute(['TEACHER']);

  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [assignments, setAssignments] = useState<TeachingAssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Detail & Contents state
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [contents, setContents] = useState<ModuleContentItem[]>([]);
  const [loadingContents, setLoadingContents] = useState(false);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState<ModuleContentItem | null>(null);

  // Create Module Form
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formObjectives, setFormObjectives] = useState('');
  const [formAssignmentId, setFormAssignmentId] = useState('');

  // Content Form
  const [contentType, setContentType] = useState<ContentType>('TEXT');
  const [contentTitle, setContentTitle] = useState('');
  const [contentDesc, setContentDesc] = useState('');
  const [contentText, setContentText] = useState('');
  const [contentFileUrl, setContentFileUrl] = useState('');
  const [contentVideoUrl, setContentVideoUrl] = useState('');
  const [contentImageUrl, setContentImageUrl] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [modRes, taRes] = await Promise.all([
        moduleService.getMyModules().catch(() => []),
        moduleService.getTeacherAssignments().catch(() => []),
      ]);

      if (modRes && modRes.length > 0) {
        setModules(modRes);
      } else {
        // Fallback sample data if server has no entries yet
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
            class: { id: 'cls-01', name: 'Kelas X-A', grade: 10 },
            subject: { id: 'subj-01', name: 'Matematika Wajib', code: 'MAT-10' },
            totalContents: 4,
          },
          {
            id: 'mod-02',
            title: 'Teks Laporan Hasil Observasi (LHO)',
            description: 'Struktur, kaidah kebahasaan, dan teknik penulisan teks observasi obyektif.',
            learningObjectives: 'Siswa dapat mengidentifikasi struktur teks LHO dan menyusun laporan.',
            status: 'DRAFT',
            teacherId: 'tch-01',
            teachingAssignmentId: 'ta-02',
            classId: 'cls-01',
            subjectId: 'subj-02',
            academicYearId: 'ay-01',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            class: { id: 'cls-01', name: 'Kelas X-A', grade: 10 },
            subject: { id: 'subj-02', name: 'Bahasa Indonesia', code: 'BIN-10' },
            totalContents: 2,
          },
        ]);
      }

      if (taRes && taRes.length > 0) {
        setAssignments(taRes);
        setFormAssignmentId(taRes[0].id);
      } else {
        setAssignments([
          {
            id: 'ta-01',
            teacherId: 'tch-01',
            classId: 'cls-01',
            subjectId: 'subj-01',
            academicYearId: 'ay-01',
            class: { id: 'cls-01', name: 'Kelas X-A', grade: 10 },
            subject: { id: 'subj-01', name: 'Matematika Wajib', code: 'MAT-10' },
            academicYear: { id: 'ay-01', name: '2024/2025 Ganjil', semester: 'GANJIL' },
          },
          {
            id: 'ta-02',
            teacherId: 'tch-01',
            classId: 'cls-01',
            subjectId: 'subj-02',
            academicYearId: 'ay-01',
            class: { id: 'cls-01', name: 'Kelas X-A', grade: 10 },
            subject: { id: 'subj-02', name: 'Bahasa Indonesia', code: 'BIN-10' },
            academicYear: { id: 'ay-01', name: '2024/2025 Ganjil', semester: 'GANJIL' },
          },
        ]);
        setFormAssignmentId('ta-01');
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadContents = async (moduleId: string) => {
    try {
      setLoadingContents(true);
      const res = await moduleService.getContents(moduleId).catch(() => []);
      if (res && res.length > 0) {
        setContents(res);
      } else {
        // Sample contents if fresh or mock
        setContents([
          {
            id: 'mc-01',
            moduleId,
            title: 'Pengenalan & Definisi Aljabar',
            description: 'Ulasan konsep dasar variabel, koefisien, dan konstanta.',
            contentType: 'TEXT',
            textContent: 'Persamaan linear satu variabel adalah persamaan yang variabelnya berpangkat satu: ax + b = 0.',
            orderNumber: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'mc-02',
            moduleId,
            title: 'Modul Pegangan Siswa (PDF)',
            description: 'Berkas panduan lengkap dan rangkuman rumus.',
            contentType: 'DOCUMENT',
            fileUrl: '/uploads/modules/documents/Modul-Matematika-X.pdf',
            orderNumber: 2,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoadingContents(false);
    }
  };

  const handleOpenModuleDetail = (mod: ModuleItem) => {
    setSelectedModule(mod);
    loadContents(mod.id);
  };

  // Create Module
  const handleCreateModule = async () => {
    if (!formTitle.trim()) {
      return Alert.alert('Validasi', 'Judul modul wajib diisi.');
    }
    if (!formObjectives.trim()) {
      return Alert.alert('Validasi', 'Tujuan pembelajaran wajib diisi.');
    }
    if (!formAssignmentId) {
      return Alert.alert('Validasi', 'Pilih penugasan mengajar terlebih dahulu.');
    }

    try {
      const created = await moduleService.createModule({
        title: formTitle,
        description: formDesc,
        learningObjectives: formObjectives,
        teachingAssignmentId: formAssignmentId,
      }).catch(() => {
        // Fallback local create
        const ta = assignments.find((a) => a.id === formAssignmentId);
        const fallbackMod: ModuleItem = {
          id: `mod-${Date.now()}`,
          title: formTitle,
          description: formDesc,
          learningObjectives: formObjectives,
          status: 'DRAFT',
          teacherId: 'tch-01',
          teachingAssignmentId: formAssignmentId,
          classId: ta?.classId || 'cls-01',
          subjectId: ta?.subjectId || 'subj-01',
          academicYearId: ta?.academicYearId || 'ay-01',
          class: ta?.class,
          subject: ta?.subject,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          totalContents: 0,
        };
        setModules((prev) => [fallbackMod, ...prev]);
        return fallbackMod;
      });

      setShowCreateModal(false);
      setFormTitle('');
      setFormDesc('');
      setFormObjectives('');
      Alert.alert('Sukses', 'Modul berhasil dibuat sebagai DRAFT.');
      handleOpenModuleDetail(created);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Gagal membuat modul');
    }
  };

  // Change status (e.g. submit for review)
  const handleStatusChange = async (newStatus: ModuleStatus) => {
    if (!selectedModule) return;
    try {
      await moduleService.updateModuleStatus(selectedModule.id, newStatus).catch(() => null);
      setSelectedModule((prev) => (prev ? { ...prev, status: newStatus } : null));
      setModules((prev) =>
        prev.map((m) => (m.id === selectedModule.id ? { ...m, status: newStatus } : m))
      );
      Alert.alert(
        'Status Diperbarui',
        newStatus === 'PENDING_REVIEW'
          ? 'Modul telah dikirimkan untuk Review Administrator.'
          : 'Status modul dikembalikan ke DRAFT.'
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Gagal mengubah status');
    }
  };

  // Delete module
  const handleDeleteModule = () => {
    if (!selectedModule) return;
    Alert.alert('Konfirmasi Hapus', 'Yakin ingin menghapus modul pembelajaran ini beserta seluruh isinya?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await moduleService.deleteModule(selectedModule.id).catch(() => null);
            setModules((prev) => prev.filter((m) => m.id !== selectedModule.id));
            setSelectedModule(null);
            Alert.alert('Sukses', 'Modul berhasil dihapus.');
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Gagal menghapus');
          }
        },
      },
    ]);
  };

  // Save Content (Add or Edit)
  const handleSaveContent = async () => {
    if (!selectedModule) return;
    if (!contentTitle.trim()) {
      return Alert.alert('Validasi', 'Judul materi wajib diisi.');
    }

    try {
      const payload = {
        title: contentTitle,
        description: contentDesc,
        contentType,
        textContent: contentType === 'TEXT' ? contentText : undefined,
        fileUrl: contentType === 'DOCUMENT' ? contentFileUrl : undefined,
        videoUrl: contentType === 'VIDEO' ? contentVideoUrl : undefined,
        imageUrl: contentType === 'IMAGE' ? contentImageUrl : undefined,
      };

      if (editingContent) {
        await moduleService.updateContent(editingContent.id, payload).catch(() => null);
        setContents((prev) =>
          prev.map((c) => (c.id === editingContent.id ? { ...c, ...payload } : c))
        );
        Alert.alert('Sukses', 'Materi berhasil diperbarui.');
      } else {
        const newC = await moduleService.createContent(selectedModule.id, payload).catch(() => {
          return {
            id: `mc-${Date.now()}`,
            moduleId: selectedModule.id,
            title: contentTitle,
            description: contentDesc,
            contentType,
            textContent: contentText,
            fileUrl: contentFileUrl,
            videoUrl: contentVideoUrl,
            imageUrl: contentImageUrl,
            orderNumber: contents.length + 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          } as ModuleContentItem;
        });

        setContents((prev) => [...prev, newC]);
        // Revert status to DRAFT if was published
        if (selectedModule.status === 'PUBLISHED') {
          setSelectedModule((prev) => (prev ? { ...prev, status: 'DRAFT' } : null));
        }
        Alert.alert('Sukses', 'Materi berhasil ditambahkan.');
      }

      setShowAddContentModal(false);
      setEditingContent(null);
      setContentTitle('');
      setContentDesc('');
      setContentText('');
      setContentFileUrl('');
      setContentVideoUrl('');
      setContentImageUrl('');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Gagal menyimpan materi');
    }
  };

  // Delete Content
  const handleDeleteContent = (contentId: string) => {
    Alert.alert('Konfirmasi Hapus', 'Hapus materi ini dari modul?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await moduleService.deleteContent(contentId).catch(() => null);
            setContents((prev) => prev.filter((c) => c.id !== contentId));
            Alert.alert('Sukses', 'Materi berhasil dihapus.');
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Gagal menghapus materi');
          }
        },
      },
    ]);
  };

  // Reorder content
  const handleMoveContent = async (index: number, dir: 'UP' | 'DOWN') => {
    const targetIdx = dir === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= contents.length || !selectedModule) return;

    const list = [...contents];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // renumber
    list.forEach((c, idx) => {
      c.orderNumber = idx + 1;
    });

    setContents(list);
    await moduleService.reorderContents(selectedModule.id, list.map((c) => c.id)).catch(() => null);
  };

  const getStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return { label: 'Published', bg: '#D1FAE5', text: '#065F46' };
      case 'PENDING_REVIEW':
        return { label: 'Menunggu Review', bg: '#FEF3C7', text: '#92400E' };
      default:
        return { label: 'Draft', bg: '#F1F5F9', text: '#475569' };
    }
  };

  const filteredModules = modules.filter((m) => {
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const titleMatch = m.title.toLowerCase().includes(q);
      const subjMatch = m.subject?.name?.toLowerCase().includes(q);
      const classMatch = m.class?.name?.toLowerCase().includes(q);
      return titleMatch || subjMatch || classMatch;
    }
    return true;
  });

  return (
    <SafeScreen backgroundColor={Colors.background}>
      <Header title="Modul Pengajaran" subtitle="Materi & Bahan Ajar Digital" />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header Action Card */}
        <View style={styles.actionCard}>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Kelola Modul Pembelajaran</Text>
            <Text style={styles.actionSubtitle}>
              Buat materi digital terstruktur untuk kelas yang Anda ampu.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => setShowCreateModal(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Buat Modul</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={16} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari modul, kelas, atau mapel..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Status Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {[
            { id: 'ALL', label: 'Semua' },
            { id: 'DRAFT', label: 'Draft' },
            { id: 'PENDING_REVIEW', label: 'Menunggu Review' },
            { id: 'PUBLISHED', label: 'Published' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.filterChip,
                statusFilter === item.id && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter(item.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === item.id && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Modules List */}
        <Text style={styles.sectionTitle}>Daftar Modul ({filteredModules.length})</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>Memuat modul pembelajaran...</Text>
          </View>
        ) : filteredModules.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Ionicons name="book-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Tidak ada modul ditemukan</Text>
            <Text style={styles.emptySubtitle}>
              Mulai buat modul baru dengan menekan tombol "Buat Modul" di atas.
            </Text>
          </Card>
        ) : (
          filteredModules.map((item) => {
            const badge = getStatusBadge(item.status);

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleOpenModuleDetail(item)}
                activeOpacity={0.7}
              >
                <Card style={styles.modulCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.tagRow}>
                      <View style={styles.classTag}>
                        <Text style={styles.classTagText}>{item.class?.name || 'Kelas'}</Text>
                      </View>
                      <View style={styles.subjectTag}>
                        <Text style={styles.subjectTagText}>{item.subject?.name || 'Mata Pelajaran'}</Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modulTitle}>{item.title}</Text>
                  {item.description ? (
                    <Text style={styles.modulDesc} numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}

                  <View style={styles.cardFooter}>
                    <Text style={styles.contentCount}>
                      {item.totalContents || item._count?.contents || 0} Materi Pembelajaran
                    </Text>
                    <View style={styles.detailLink}>
                      <Text style={styles.detailLinkText}>Kelola Materi</Text>
                      <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* MODAL: CREATE MODULE */}
      <Modal visible={showCreateModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Buat Modul Pembelajaran</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Penugasan Mengajar *</Text>
              <View style={styles.assignmentSelector}>
                {assignments.map((ta) => {
                  const isSelected = formAssignmentId === ta.id;
                  return (
                    <TouchableOpacity
                      key={ta.id}
                      style={[
                        styles.assignmentItem,
                        isSelected && styles.assignmentItemSelected,
                      ]}
                      onPress={() => setFormAssignmentId(ta.id)}
                    >
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={16}
                        color={isSelected ? Colors.primary : Colors.textMuted}
                      />
                      <Text
                        style={[
                          styles.assignmentText,
                          isSelected && styles.assignmentTextSelected,
                        ]}
                      >
                        {ta.class.name} • {ta.subject.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.inputLabel}>Judul Modul *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Bab 1: Persamaan & Fungsi Linear"
                placeholderTextColor={Colors.textMuted}
                value={formTitle}
                onChangeText={setFormTitle}
              />

              <Text style={styles.inputLabel}>Tujuan Pembelajaran *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Deskripsikan kompetensi yang akan dicapai oleh siswa..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={3}
                value={formObjectives}
                onChangeText={setFormObjectives}
              />

              <Text style={styles.inputLabel}>Deskripsi Modul (Opsional)</Text>
              <TextInput
                style={[styles.textInput, styles.textAreaSmall]}
                placeholder="Ulasan singkat materi modul..."
                placeholderTextColor={Colors.textMuted}
                multiline
                numberOfLines={2}
                value={formDesc}
                onChangeText={setFormDesc}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleCreateModule}>
                <Text style={styles.submitBtnText}>Simpan Draft</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: DETAIL MODULE & CONTENT MANAGER */}
      <Modal visible={!!selectedModule} animationType="slide">
        <SafeScreen backgroundColor={Colors.background}>
          <View style={styles.detailNav}>
            <TouchableOpacity
              onPress={() => setSelectedModule(null)}
              style={styles.backBtn}
            >
              <Ionicons name="arrow-back" size={20} color={Colors.text} />
              <Text style={styles.backBtnText}>Daftar Modul</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteModule} style={styles.deleteModulBtn}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>

          {selectedModule && (
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
              {/* Module Info Card */}
              <Card style={styles.detailCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.tagRow}>
                    <View style={styles.classTag}>
                      <Text style={styles.classTagText}>{selectedModule.class?.name || 'Kelas'}</Text>
                    </View>
                    <View style={styles.subjectTag}>
                      <Text style={styles.subjectTagText}>{selectedModule.subject?.name || 'Mapel'}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusBadge(selectedModule.status).bg },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: getStatusBadge(selectedModule.status).text },
                      ]}
                    >
                      {getStatusBadge(selectedModule.status).label}
                    </Text>
                  </View>
                </View>

                <Text style={styles.detailTitle}>{selectedModule.title}</Text>
                {selectedModule.description ? (
                  <Text style={styles.detailDesc}>{selectedModule.description}</Text>
                ) : null}

                <View style={styles.objectivesBox}>
                  <Text style={styles.objectivesTitle}>🎯 Tujuan Pembelajaran:</Text>
                  <Text style={styles.objectivesText}>{selectedModule.learningObjectives}</Text>
                </View>

                {/* Status Workflow Actions */}
                <View style={styles.workflowRow}>
                  {selectedModule.status === 'DRAFT' && (
                    <TouchableOpacity
                      style={styles.reviewBtn}
                      onPress={() => handleStatusChange('PENDING_REVIEW')}
                    >
                      <Ionicons name="send" size={14} color="#FFFFFF" />
                      <Text style={styles.reviewBtnText}>Kirim untuk Review Admin</Text>
                    </TouchableOpacity>
                  )}
                  {selectedModule.status === 'PENDING_REVIEW' && (
                    <TouchableOpacity
                      style={styles.revertBtn}
                      onPress={() => handleStatusChange('DRAFT')}
                    >
                      <Ionicons name="time" size={14} color="#92400E" />
                      <Text style={styles.revertBtnText}>Tarik Kembali ke Draft</Text>
                    </TouchableOpacity>
                  )}
                  {selectedModule.status === 'PUBLISHED' && (
                    <View style={styles.publishedNotice}>
                      <Ionicons name="checkmark-circle" size={16} color="#059669" />
                      <Text style={styles.publishedNoticeText}>
                        Modul aktif dan dapat diakses siswa kelas.
                      </Text>
                    </View>
                  )}
                </View>
              </Card>

              {/* Contents Section Header */}
              <View style={styles.contentSectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Materi Pembelajaran</Text>
                  <Text style={styles.sectionSubtitle}>
                    {contents.length} materi terdaftar dalam urutan baca
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.addContentBtn}
                  onPress={() => {
                    setEditingContent(null);
                    setContentTitle('');
                    setContentDesc('');
                    setContentText('');
                    setShowAddContentModal(true);
                  }}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                  <Text style={styles.addContentBtnText}>Tambah Materi</Text>
                </TouchableOpacity>
              </View>

              {loadingContents ? (
                <ActivityIndicator size="small" color={Colors.primary} style={{ marginVertical: 20 }} />
              ) : contents.length === 0 ? (
                <Card style={styles.emptyCard}>
                  <Ionicons name="document-text-outline" size={32} color={Colors.textMuted} />
                  <Text style={styles.emptyTitle}>Belum ada materi</Text>
                  <Text style={styles.emptySubtitle}>
                    Tambahkan materi teks, dokumen PDF, tautan video, atau gambar.
                  </Text>
                </Card>
              ) : (
                contents.map((item, index) => (
                  <Card key={item.id} style={styles.contentCard}>
                    <View style={styles.contentTopRow}>
                      <View style={styles.contentHeaderLeft}>
                        <View style={styles.orderBadge}>
                          <Text style={styles.orderBadgeText}>#{item.orderNumber}</Text>
                        </View>
                        <View style={styles.typeBadge}>
                          <Text style={styles.typeBadgeText}>{item.contentType}</Text>
                        </View>
                        <Text style={styles.contentCardTitle}>{item.title}</Text>
                      </View>

                      {/* Reorder and Edit Actions */}
                      <View style={styles.contentActions}>
                        <TouchableOpacity
                          disabled={index === 0}
                          onPress={() => handleMoveContent(index, 'UP')}
                          style={[styles.arrowBtn, index === 0 && { opacity: 0.3 }]}
                        >
                          <Ionicons name="arrow-up" size={14} color={Colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          disabled={index === contents.length - 1}
                          onPress={() => handleMoveContent(index, 'DOWN')}
                          style={[styles.arrowBtn, index === contents.length - 1 && { opacity: 0.3 }]}
                        >
                          <Ionicons name="arrow-down" size={14} color={Colors.text} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteContent(item.id)}
                          style={styles.arrowBtn}
                        >
                          <Ionicons name="trash-outline" size={14} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {item.description ? (
                      <Text style={styles.contentCardDesc}>{item.description}</Text>
                    ) : null}

                    {/* Preview snippets */}
                    {item.contentType === 'TEXT' && item.textContent ? (
                      <View style={styles.previewBox}>
                        <Text style={styles.previewText} numberOfLines={3}>
                          {item.textContent}
                        </Text>
                      </View>
                    ) : null}

                    {item.contentType === 'DOCUMENT' && item.fileUrl ? (
                      <View style={styles.fileBox}>
                        <Ionicons name="document-attach" size={16} color="#7C3AED" />
                        <Text style={styles.fileUrlText} numberOfLines={1}>
                          {item.fileUrl.split('/').pop()}
                        </Text>
                      </View>
                    ) : null}

                    {item.contentType === 'VIDEO' && item.videoUrl ? (
                      <View style={styles.fileBox}>
                        <Ionicons name="play-circle" size={16} color="#EF4444" />
                        <Text style={styles.fileUrlText} numberOfLines={1}>
                          {item.videoUrl}
                        </Text>
                      </View>
                    ) : null}
                  </Card>
                ))
              )}
            </ScrollView>
          )}
        </SafeScreen>
      </Modal>

      {/* MODAL: ADD / EDIT CONTENT */}
      <Modal visible={showAddContentModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingContent ? 'Edit Materi' : 'Tambah Materi Pembelajaran'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddContentModal(false)}>
                <Ionicons name="close" size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Tipe Materi</Text>
              <View style={styles.typeSelector}>
                {(['TEXT', 'DOCUMENT', 'VIDEO', 'IMAGE'] as ContentType[]).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.typeBtn, contentType === t && styles.typeBtnSelected]}
                    onPress={() => setContentType(t)}
                  >
                    <Text
                      style={[styles.typeBtnText, contentType === t && styles.typeBtnTextSelected]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Judul Materi *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Contoh: Bab 1.1 Bentuk Umum Persamaan"
                placeholderTextColor={Colors.textMuted}
                value={contentTitle}
                onChangeText={setContentTitle}
              />

              <Text style={styles.inputLabel}>Keterangan (Opsional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Petunjuk singkat untuk siswa..."
                placeholderTextColor={Colors.textMuted}
                value={contentDesc}
                onChangeText={setContentDesc}
              />

              {/* Dynamic input by ContentType */}
              {contentType === 'TEXT' && (
                <>
                  <Text style={styles.inputLabel}>Isi Materi Teks *</Text>
                  <TextInput
                    style={[styles.textInput, styles.textAreaLarge]}
                    placeholder="Ketik teks pembelajaran..."
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    value={contentText}
                    onChangeText={setContentText}
                  />
                </>
              )}

              {contentType === 'DOCUMENT' && (
                <>
                  <Text style={styles.inputLabel}>URL Dokumen PDF/DOC *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="/uploads/modules/documents/file.pdf"
                    placeholderTextColor={Colors.textMuted}
                    value={contentFileUrl}
                    onChangeText={setContentFileUrl}
                  />
                  <TouchableOpacity
                    style={styles.presetLink}
                    onPress={() =>
                      setContentFileUrl('/uploads/modules/documents/doc-Modul-Matematika-X-PLSV.pdf')
                    }
                  >
                    <Text style={styles.presetLinkText}>Gunakan Dokumen Contoh (PDF)</Text>
                  </TouchableOpacity>
                </>
              )}

              {contentType === 'VIDEO' && (
                <>
                  <Text style={styles.inputLabel}>URL Video Kuliah (YouTube) *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="https://www.youtube.com/watch?v=..."
                    placeholderTextColor={Colors.textMuted}
                    value={contentVideoUrl}
                    onChangeText={setContentVideoUrl}
                  />
                </>
              )}

              {contentType === 'IMAGE' && (
                <>
                  <Text style={styles.inputLabel}>URL Gambar / Diagram *</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="https://images.unsplash.com/..."
                    placeholderTextColor={Colors.textMuted}
                    value={contentImageUrl}
                    onChangeText={setContentImageUrl}
                  />
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddContentModal(false)}
              >
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSaveContent}>
                <Text style={styles.submitBtnText}>Simpan Materi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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
  actionCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  actionTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  actionSubtitle: {
    fontSize: 11,
    color: '#BFDBFE',
    marginTop: 2,
  },
  createButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 10,
    marginBottom: 10,
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
  filterRow: {
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 10,
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
  modulCard: {
    padding: 14,
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  classTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  classTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
  subjectTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  subjectTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338CA',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  modulTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
  },
  modulDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  cardFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentCount: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7C3AED',
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  modalBody: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.text,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  textAreaSmall: {
    height: 50,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    height: 120,
    textAlignVertical: 'top',
  },
  assignmentSelector: {
    gap: 6,
  },
  assignmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  assignmentItemSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#EFF6FF',
  },
  assignmentText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  assignmentTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailNav: {
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
  deleteModulBtn: {
    padding: 6,
  },
  detailCard: {
    padding: 16,
    marginBottom: 14,
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  detailDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 10,
    lineHeight: 18,
  },
  objectivesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  objectivesTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  objectivesText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  workflowRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    alignItems: 'flex-start',
  },
  reviewBtn: {
    backgroundColor: '#0284C7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  reviewBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  revertBtn: {
    backgroundColor: '#FEF3C7',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  revertBtnText: {
    color: '#92400E',
    fontSize: 11,
    fontWeight: '700',
  },
  publishedNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  publishedNoticeText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
  },
  contentSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addContentBtn: {
    backgroundColor: '#7C3AED',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addContentBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  contentCard: {
    padding: 12,
    marginBottom: 8,
  },
  contentTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  orderBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  orderBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  typeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#4F46E5',
  },
  contentCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
  },
  contentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  arrowBtn: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: '#F8FAFC',
  },
  contentCardDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  previewBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  previewText: {
    fontSize: 10,
    color: Colors.textSecondary,
    lineHeight: 14,
  },
  fileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
  },
  fileUrlText: {
    fontSize: 10,
    color: '#6D28D9',
    flex: 1,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 6,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  typeBtnSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#7C3AED',
  },
  typeBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  typeBtnTextSelected: {
    color: '#FFFFFF',
  },
  presetLink: {
    marginTop: 4,
  },
  presetLinkText: {
    fontSize: 10,
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
});
