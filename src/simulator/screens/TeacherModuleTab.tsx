import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  BookOpen,
  ArrowLeft,
  UploadCloud,
  FileCheck,
  Video,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { User, ModuleItem, ModuleContent, ModuleStatus, ContentType, TeachingAssignment } from '../types';
import { moduleApi } from '../mockApi';

interface TeacherModuleTabProps {
  user: User;
}

export const TeacherModuleTab: React.FC<TeacherModuleTabProps> = ({ user }) => {
  const teacherId = user.teacher?.id || 'tch-01';

  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [assignments, setAssignments] = useState<TeachingAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected module for detail/editing contents
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleItem | null>(null);
  const [contents, setContents] = useState<ModuleContent[]>([]);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddContentModal, setShowAddContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState<ModuleContent | null>(null);
  const [expandedContentId, setExpandedContentId] = useState<string | null>(null);

  // Form states - Module
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    learningObjectives: '',
    teachingAssignmentId: '',
    thumbnailUrl: '',
  });

  // Form states - Content
  const [contentFormData, setContentFormData] = useState<{
    title: string;
    description: string;
    contentType: ContentType;
    textContent: string;
    fileUrl: string;
    videoUrl: string;
    imageUrl: string;
  }>({
    title: '',
    description: '',
    contentType: 'TEXT',
    textContent: '',
    fileUrl: '',
    videoUrl: '',
    imageUrl: '',
  });

  const [notification, setNotification] = useState<string | null>(null);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [modList, taList] = await Promise.all([
        moduleApi.getMyModules(teacherId),
        moduleApi.getTeacherAssignments(teacherId),
      ]);
      setModules(modList);
      setAssignments(taList);

      if (taList.length > 0 && !formData.teachingAssignmentId) {
        setFormData((prev) => ({ ...prev, teachingAssignmentId: taList[0].id }));
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [teacherId]);

  // Load single module detail
  const loadModuleDetail = async (id: string) => {
    try {
      const mod = await moduleApi.getModuleById(id);
      setActiveModule(mod);
      const cList = await moduleApi.getContents(id);
      setContents(cList);
    } catch (err: any) {
      showNotify(err.message || 'Gagal memuat modul');
    }
  };

  useEffect(() => {
    if (selectedModuleId) {
      loadModuleDetail(selectedModuleId);
    } else {
      setActiveModule(null);
      setContents([]);
    }
  }, [selectedModuleId]);

  // Handle Create Module
  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert('Judul modul wajib diisi');
    if (!formData.learningObjectives.trim()) return alert('Tujuan pembelajaran wajib diisi');
    if (!formData.teachingAssignmentId) return alert('Pilih penugasan mengajar');

    try {
      const created = await moduleApi.createModule(teacherId, {
        title: formData.title,
        description: formData.description,
        learningObjectives: formData.learningObjectives,
        teachingAssignmentId: formData.teachingAssignmentId,
        thumbnailUrl: formData.thumbnailUrl || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600',
      });
      setShowCreateModal(false);
      setFormData({
        title: '',
        description: '',
        learningObjectives: '',
        teachingAssignmentId: assignments[0]?.id || '',
        thumbnailUrl: '',
      });
      showNotify('Modul berhasil dibuat sebagai DRAFT.');
      await loadData();
      setSelectedModuleId(created.id);
    } catch (err: any) {
      alert(err.message || 'Gagal membuat modul');
    }
  };

  // Handle Edit Module Metadata
  const handleUpdateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModule) return;
    try {
      const result = await moduleApi.updateModule(activeModule.id, teacherId, {
        title: activeModule.title,
        description: activeModule.description || '',
        learningObjectives: activeModule.learningObjectives,
        thumbnailUrl: activeModule.thumbnailUrl || undefined,
      });
      setActiveModule(result.module);
      setShowEditModal(false);
      if (result.revertedToDraft) {
        showNotify('Perubahan disimpan. Status modul dikembalikan ke DRAFT untuk ditinjau.');
      } else {
        showNotify('Informasi modul berhasil diperbarui.');
      }
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah modul');
    }
  };

  // Handle Status Change (Teacher -> PENDING_REVIEW or DRAFT)
  const handleStatusChange = async (newStatus: ModuleStatus) => {
    if (!activeModule) return;
    try {
      const updated = await moduleApi.updateModuleStatus(activeModule.id, newStatus, 'TEACHER', teacherId);
      setActiveModule(updated);
      showNotify(
        newStatus === 'PENDING_REVIEW'
          ? 'Modul berhasil diajukan untuk Review Administrator.'
          : 'Status modul dikembalikan ke DRAFT.'
      );
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal memperbarui status');
    }
  };

  // Handle Delete Module
  const handleDeleteModule = async () => {
    if (!activeModule) return;
    if (!confirm('Apakah Anda yakin ingin menghapus modul ini berserta seluruh materinya?')) return;
    try {
      await moduleApi.deleteModule(activeModule.id, teacherId);
      showNotify('Modul berhasil dihapus.');
      setSelectedModuleId(null);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus modul');
    }
  };

  // Handle Save Content (Add or Edit)
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModule) return;
    if (!contentFormData.title.trim()) return alert('Judul materi wajib diisi');

    if (contentFormData.contentType === 'TEXT' && !contentFormData.textContent.trim()) {
      return alert('Konten teks materi wajib diisi');
    }
    if (contentFormData.contentType === 'DOCUMENT' && !contentFormData.fileUrl.trim()) {
      return alert('URL berkas dokumen wajib diisi');
    }
    if (contentFormData.contentType === 'VIDEO' && !contentFormData.videoUrl.trim()) {
      return alert('URL video wajib diisi');
    }
    if (contentFormData.contentType === 'IMAGE' && !contentFormData.imageUrl.trim()) {
      return alert('URL gambar wajib diisi');
    }

    try {
      if (editingContent) {
        await moduleApi.updateContent(editingContent.id, contentFormData);
        showNotify('Materi berhasil diperbarui.');
      } else {
        await moduleApi.createContent(activeModule.id, contentFormData);
        showNotify('Materi berhasil ditambahkan ke modul.');
      }

      setShowAddContentModal(false);
      setEditingContent(null);
      setContentFormData({
        title: '',
        description: '',
        contentType: 'TEXT',
        textContent: '',
        fileUrl: '',
        videoUrl: '',
        imageUrl: '',
      });
      await loadModuleDetail(activeModule.id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan materi');
    }
  };

  // Handle Delete Content
  const handleDeleteContent = async (contentId: string) => {
    if (!confirm('Hapus materi ini?')) return;
    try {
      await moduleApi.deleteContent(contentId);
      showNotify('Materi berhasil dihapus.');
      if (activeModule) {
        await loadModuleDetail(activeModule.id);
        await loadData();
      }
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus materi');
    }
  };

  // Handle Reorder Content (Move Up / Down)
  const handleMoveContent = async (index: number, direction: 'UP' | 'DOWN') => {
    if (!activeModule) return;
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= contents.length) return;

    const newContents = [...contents];
    const temp = newContents[index];
    newContents[index] = newContents[targetIdx];
    newContents[targetIdx] = temp;

    const ids = newContents.map((c) => c.id);
    try {
      const reordered = await moduleApi.reorderContents(activeModule.id, ids);
      setContents(reordered);
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah urutan materi');
    }
  };

  const getStatusBadge = (status: ModuleStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={11} />
            Published
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={11} />
            Menunggu Review
          </span>
        );
      case 'ARCHIVED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            Arsip
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            Draft
          </span>
        );
    }
  };

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'TEXT':
        return <FileText size={16} className="text-blue-600" />;
      case 'DOCUMENT':
        return <FileCheck size={16} className="text-purple-600" />;
      case 'VIDEO':
        return <Video size={16} className="text-rose-600" />;
      case 'IMAGE':
        return <ImageIcon size={16} className="text-emerald-600" />;
    }
  };

  // Filtered modules
  const filteredModules = modules.filter((m) => {
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        m.title.toLowerCase().includes(q) ||
        (m.subjectName && m.subjectName.toLowerCase().includes(q)) ||
        (m.className && m.className.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // RENDER: MODULE DETAIL & CONTENT MANAGER
  if (selectedModuleId && activeModule) {
    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-4">
        {notification && (
          <div className="bg-emerald-600 text-white text-xs py-2 px-3 rounded-xl shadow flex items-center gap-2">
            <CheckCircle2 size={14} />
            <span>{notification}</span>
          </div>
        )}

        {/* Back navigation & actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedModuleId(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Daftar</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 shadow-sm"
            >
              <Edit3 size={13} />
              <span>Edit Info</span>
            </button>
            <button
              onClick={handleDeleteModule}
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-100 shadow-sm"
            >
              <Trash2 size={13} />
              <span>Hapus</span>
            </button>
          </div>
        </div>

        {/* Module Header Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                  {activeModule.className}
                </span>
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  {activeModule.subjectName}
                </span>
                {getStatusBadge(activeModule.status)}
              </div>
              <h2 className="text-sm font-bold text-slate-900">{activeModule.title}</h2>
              {activeModule.description && (
                <p className="text-xs text-slate-600 mt-1">{activeModule.description}</p>
              )}
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-800 text-[11px] block">🎯 Tujuan Pembelajaran:</span>
            <p className="text-slate-600 leading-relaxed">{activeModule.learningObjectives}</p>
          </div>

          {/* Status Workflow Action */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="text-[11px] text-slate-500">
              {contents.length} Materi Pembelajaran Tersedia
            </div>
            {activeModule.status === 'DRAFT' && (
              <button
                onClick={() => handleStatusChange('PENDING_REVIEW')}
                className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm"
              >
                <Send size={13} />
                <span>Kirim untuk Review Admin</span>
              </button>
            )}
            {activeModule.status === 'PENDING_REVIEW' && (
              <button
                onClick={() => handleStatusChange('DRAFT')}
                className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-lg"
              >
                <Clock size={13} />
                <span>Tarik Kembali ke Draft</span>
              </button>
            )}
            {activeModule.status === 'PUBLISHED' && (
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 size={13} />
                Telah Terbit untuk Siswa
              </span>
            )}
          </div>
        </div>

        {/* Notice if published */}
        {activeModule.status === 'PUBLISHED' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-xs flex items-start gap-2">
            <AlertCircle size={15} className="shrink-0 mt-0.5 text-amber-600" />
            <span>
              Perhatian: Menambah atau mengedit materi pada modul yang berstatus <strong>PUBLISHED</strong> akan otomatis mengubah statusnya kembali menjadi <strong>DRAFT</strong> untuk ditinjau ulang.
            </span>
          </div>
        )}

        {/* Learning Materials Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-800">Materi Pembelajaran</h3>
              <p className="text-[11px] text-slate-500">Urutan bab dan format bahan ajar</p>
            </div>
            <button
              onClick={() => {
                setEditingContent(null);
                setContentFormData({
                  title: '',
                  description: '',
                  contentType: 'TEXT',
                  textContent: '',
                  fileUrl: '',
                  videoUrl: '',
                  imageUrl: '',
                });
                setShowAddContentModal(true);
              }}
              className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm"
            >
              <Plus size={14} />
              <span>Tambah Materi</span>
            </button>
          </div>

          {contents.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <BookOpen size={22} />
              </div>
              <h4 className="text-xs font-bold text-slate-800">Belum Ada Materi</h4>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Tambahkan materi berupa teks interaktif, dokumen PDF/DOCX, tautan video kuliah, atau infografis gambar.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {contents.map((item, index) => {
                const isExpanded = expandedContentId === item.id;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm space-y-2.5 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-400">#{item.orderNumber}</span>
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                            {getContentTypeIcon(item.contentType)}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                              {item.contentType}
                            </span>
                          </div>
                          {item.description && (
                            <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </div>

                      {/* Reorder and action controls */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveContent(index, 'UP')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                          title="Pindah ke Atas"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          disabled={index === contents.length - 1}
                          onClick={() => handleMoveContent(index, 'DOWN')}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                          title="Pindah ke Bawah"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingContent(item);
                            setContentFormData({
                              title: item.title,
                              description: item.description || '',
                              contentType: item.contentType,
                              textContent: item.textContent || '',
                              fileUrl: item.fileUrl || '',
                              videoUrl: item.videoUrl || '',
                              imageUrl: item.imageUrl || '',
                            });
                            setShowAddContentModal(true);
                          }}
                          className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                          title="Edit Materi"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteContent(item.id)}
                          className="p-1 rounded text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                          title="Hapus Materi"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Preview Toggle Button */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setExpandedContentId(isExpanded ? null : item.id)}
                        className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                      >
                        <Eye size={12} />
                        <span>{isExpanded ? 'Tutup Pratinjau' : 'Lihat Pratinjau Materi'}</span>
                      </button>
                    </div>

                    {/* Expanded Content Preview */}
                    {isExpanded && (
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 text-xs space-y-2 mt-2">
                        {item.contentType === 'TEXT' && (
                          <div className="whitespace-pre-wrap font-sans text-slate-700 text-[11px] leading-relaxed">
                            {item.textContent}
                          </div>
                        )}
                        {item.contentType === 'DOCUMENT' && (
                          <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                            <FileCheck size={18} className="text-purple-600 shrink-0" />
                            <div className="flex-1 truncate">
                              <p className="text-[11px] font-semibold text-slate-800 truncate">
                                {item.fileUrl?.split('/').pop()}
                              </p>
                              <p className="text-[10px] text-slate-400">Dokumen Pembelajaran</p>
                            </div>
                            <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-bold">
                              PDF / DOC
                            </span>
                          </div>
                        )}
                        {item.contentType === 'VIDEO' && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] text-rose-600 font-semibold">
                              <Video size={14} />
                              <a
                                href={item.videoUrl || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="truncate underline flex items-center gap-1"
                              >
                                {item.videoUrl}
                                <ExternalLink size={11} />
                              </a>
                            </div>
                          </div>
                        )}
                        {item.contentType === 'IMAGE' && item.imageUrl && (
                          <div className="rounded-lg overflow-hidden border border-slate-200 max-h-40 flex items-center justify-center bg-black/5">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="max-h-40 w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL: ADD / EDIT CONTENT */}
        {showAddContentModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
            <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-3">
              <h3 className="text-xs font-bold text-slate-900">
                {editingContent ? 'Edit Materi Pembelajaran' : 'Tambah Materi Baru'}
              </h3>

              <form onSubmit={handleSaveContent} className="space-y-3">
                {/* Content Type Selector */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Jenis Materi
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['TEXT', 'DOCUMENT', 'VIDEO', 'IMAGE'] as ContentType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setContentFormData({ ...contentFormData, contentType: type })}
                        className={`py-2 px-1 text-center rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1 transition-all ${
                          contentFormData.contentType === type
                            ? 'bg-purple-600 text-white border-purple-600 shadow'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {getContentTypeIcon(type)}
                        <span>{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Judul Materi *
                  </label>
                  <input
                    type="text"
                    required
                    value={contentFormData.title}
                    onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })}
                    placeholder="Contoh: Bab 1 - Konsep Persamaan"
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Deskripsi Ringkas (Opsional)
                  </label>
                  <input
                    type="text"
                    value={contentFormData.description}
                    onChange={(e) => setContentFormData({ ...contentFormData, description: e.target.value })}
                    placeholder="Keterangan singkat..."
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Dynamic Fields */}
                {contentFormData.contentType === 'TEXT' && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Isi Teks Materi *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={contentFormData.textContent}
                      onChange={(e) => setContentFormData({ ...contentFormData, textContent: e.target.value })}
                      placeholder="Ketik teks pembelajaran atau gunakan format markdown..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    />
                  </div>
                )}

                {contentFormData.contentType === 'DOCUMENT' && (
                  <div className="space-y-2">
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      URL Dokumen (PDF/DOC) *
                    </label>
                    <input
                      type="text"
                      required
                      value={contentFormData.fileUrl}
                      onChange={(e) => setContentFormData({ ...contentFormData, fileUrl: e.target.value })}
                      placeholder="/uploads/modules/documents/file.pdf"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() =>
                          setContentFormData({
                            ...contentFormData,
                            fileUrl: '/uploads/modules/documents/doc-Modul-Matematika-X-PLSV.pdf',
                          })
                        }
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-700 border"
                      >
                        Preset PDF Matematika
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setContentFormData({
                            ...contentFormData,
                            fileUrl: '/uploads/modules/documents/doc-Pedoman-LHO-Kelas-X.pdf',
                          })
                        }
                        className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-700 border"
                      >
                        Preset PDF Bahasa
                      </button>
                    </div>
                  </div>
                )}

                {contentFormData.contentType === 'VIDEO' && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      URL Video (YouTube / Link) *
                    </label>
                    <input
                      type="url"
                      required
                      value={contentFormData.videoUrl}
                      onChange={(e) => setContentFormData({ ...contentFormData, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {contentFormData.contentType === 'IMAGE' && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      URL Gambar (JPG/PNG) *
                    </label>
                    <input
                      type="url"
                      required
                      value={contentFormData.imageUrl}
                      onChange={(e) => setContentFormData({ ...contentFormData, imageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddContentModal(false);
                      setEditingContent(null);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow"
                  >
                    Simpan Materi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: EDIT MODULE METADATA */}
        {showEditModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
            <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Edit Informasi Modul</h3>
              <form onSubmit={handleUpdateModule} className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Judul Modul *
                  </label>
                  <input
                    type="text"
                    required
                    value={activeModule.title}
                    onChange={(e) => setActiveModule({ ...activeModule, title: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Tujuan Pembelajaran *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={activeModule.learningObjectives}
                    onChange={(e) =>
                      setActiveModule({ ...activeModule, learningObjectives: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Deskripsi Modul
                  </label>
                  <textarea
                    rows={2}
                    value={activeModule.description || ''}
                    onChange={(e) =>
                      setActiveModule({ ...activeModule, description: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RENDER: MODULES LIST VIEW
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-3.5">
      {notification && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-3 rounded-xl shadow flex items-center gap-2">
          <CheckCircle2 size={14} />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-slate-900">Modul Pengajaran Saya</h3>
          <p className="text-[11px] text-slate-500">Kelola modul & materi pembelajaran digital</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition"
        >
          <Plus size={14} />
          <span>Buat Modul</span>
        </button>
      </div>

      {/* Search & Filter Chips */}
      <div className="space-y-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, kelas, atau mapel..."
            className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-semibold no-scrollbar">
          {[
            { id: 'ALL', label: 'Semua Status' },
            { id: 'DRAFT', label: 'Draft' },
            { id: 'PENDING_REVIEW', label: 'Menunggu Review' },
            { id: 'PUBLISHED', label: 'Published' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all border ${
                statusFilter === item.id
                  ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Module List Cards */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Memuat modul pembelajaran...</div>
        ) : filteredModules.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <BookOpen size={20} />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Tidak ada modul ditemukan</h4>
            <p className="text-[11px] text-slate-500">
              {search || statusFilter !== 'ALL'
                ? 'Coba sesuaikan kata kunci atau filter pencarian Anda.'
                : 'Mulai buat modul baru dengan memilih salah satu penugasan mengajar Anda.'}
            </p>
          </div>
        ) : (
          filteredModules.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedModuleId(item.id)}
              className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm hover:border-sky-300 cursor-pointer transition-all space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                    {item.className}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {item.subjectName}
                  </span>
                </div>
                {getStatusBadge(item.status)}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.title}</h4>
                {item.description && (
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{item.description}</p>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-purple-700">
                  {item.totalContents || 0} Materi Pembelajaran
                </span>
                <div className="flex items-center gap-1 text-sky-600 font-semibold text-[11px]">
                  <span>Kelola Materi</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: CREATE MODULE */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900">Buat Modul Pembelajaran Baru</h3>
              <p className="text-[11px] text-slate-500">
                Pilih penugasan mengajar untuk menentukan kelas dan mata pelajaran otomatis.
              </p>
            </div>

            <form onSubmit={handleCreateModule} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Penugasan Mengajar (Teaching Assignment) *
                </label>
                {assignments.length === 0 ? (
                  <div className="bg-rose-50 text-rose-700 text-xs p-2.5 rounded-xl border border-rose-200">
                    Anda belum memiliki penugasan mengajar aktif. Harap hubungi Administrator.
                  </div>
                ) : (
                  <select
                    required
                    value={formData.teachingAssignmentId}
                    onChange={(e) => setFormData({ ...formData, teachingAssignmentId: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {assignments.map((ta) => (
                      <option key={ta.id} value={ta.id}>
                        {ta.class.name} • {ta.subject.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Judul Modul *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: Bab 1 - Aljabar Linier"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Tujuan Pembelajaran *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.learningObjectives}
                  onChange={(e) => setFormData({ ...formData, learningObjectives: e.target.value })}
                  placeholder="Deskripsikan kompetensi dasar yang diharapkan dicapai siswa..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Deskripsi Modul (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Penjelasan ringkas isi modul..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={assignments.length === 0}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-50 rounded-lg shadow"
                >
                  Simpan sebagai Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
