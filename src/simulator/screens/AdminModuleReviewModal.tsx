import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Search,
  FileText,
  FileCheck,
  Video,
  Image as ImageIcon,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Send,
  X,
  Eye,
} from 'lucide-react';
import { ModuleItem, ModuleContent, ModuleStatus, ContentType } from '../types';
import { moduleApi } from '../mockApi';

interface AdminModuleReviewModalProps {
  onClose: () => void;
  onRefreshStats?: () => void;
}

export const AdminModuleReviewModal: React.FC<AdminModuleReviewModalProps> = ({
  onClose,
  onRefreshStats,
}) => {
  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING_REVIEW');
  const [search, setSearch] = useState('');

  // Selected module for detail review
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [contents, setContents] = useState<ModuleContent[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const loadModules = async () => {
    try {
      setLoading(true);
      const list = await moduleApi.getAllModules();
      setModules(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const loadModuleDetail = async (mod: ModuleItem) => {
    try {
      setSelectedModule(mod);
      const cList = await moduleApi.getContents(mod.id);
      setContents(cList);
    } catch (err: any) {
      showNotify(err.message || 'Gagal memuat detail modul');
    }
  };

  const handleUpdateStatus = async (moduleId: string, newStatus: ModuleStatus) => {
    try {
      await moduleApi.updateModuleStatus(moduleId, newStatus, 'ADMIN');
      showNotify(
        newStatus === 'PUBLISHED'
          ? 'Modul berhasil disetujui & dipublikasikan untuk siswa!'
          : 'Modul dikembalikan ke status DRAFT.'
      );
      await loadModules();
      if (selectedModule && selectedModule.id === moduleId) {
        const updated = await moduleApi.getModuleById(moduleId);
        setSelectedModule(updated);
      }
      onRefreshStats?.();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status modul');
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
        return <FileText size={15} className="text-blue-600" />;
      case 'DOCUMENT':
        return <FileCheck size={15} className="text-purple-600" />;
      case 'VIDEO':
        return <Video size={15} className="text-rose-600" />;
      case 'IMAGE':
        return <ImageIcon size={15} className="text-emerald-600" />;
    }
  };

  const filtered = modules.filter((m) => {
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        m.title.toLowerCase().includes(q) ||
        (m.teacherName && m.teacherName.toLowerCase().includes(q)) ||
        (m.subjectName && m.subjectName.toLowerCase().includes(q)) ||
        (m.className && m.className.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const pendingCount = modules.filter((m) => m.status === 'PENDING_REVIEW').length;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl max-w-md w-full h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {selectedModule && (
              <button
                onClick={() => setSelectedModule(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mr-1"
              >
                <ArrowLeft size={14} />
              </button>
            )}
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                {selectedModule ? 'Tinjauan Detail Modul' : 'Review Modul Pembelajaran'}
              </h3>
              <p className="text-[10px] text-slate-500">
                {selectedModule
                  ? `${selectedModule.subjectName} • ${selectedModule.className}`
                  : `${pendingCount} modul menunggu persetujuan admin`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
          >
            <X size={15} />
          </button>
        </div>

        {notification && (
          <div className="bg-emerald-600 text-white text-[11px] py-1.5 px-3 flex items-center gap-1.5 shrink-0">
            <CheckCircle2 size={13} />
            <span>{notification}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {selectedModule ? (
            /* DETAIL REVIEW VIEW */
            <div className="space-y-3.5">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {selectedModule.className}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {selectedModule.subjectName}
                    </span>
                    {getStatusBadge(selectedModule.status)}
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900">{selectedModule.title}</h4>
                <p className="text-[11px] text-slate-500">
                  Guru Pengajar: <strong>{selectedModule.teacherName}</strong>
                </p>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 text-[10px] block mb-0.5">
                    🎯 Tujuan Pembelajaran:
                  </span>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    {selectedModule.learningObjectives}
                  </p>
                </div>

                {selectedModule.description && (
                  <p className="text-[11px] text-slate-500 italic">
                    "{selectedModule.description}"
                  </p>
                )}
              </div>

              {/* Admin Decision Action Buttons */}
              <div className="bg-slate-100 p-3 rounded-xl space-y-2">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
                  Aksi Administrator:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedModule.id, 'PUBLISHED')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle2 size={14} />
                    <span>Setujui & Publikasikan</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedModule.id, 'DRAFT')}
                    className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <Clock size={14} />
                    <span>Kembalikan ke Draft</span>
                  </button>
                </div>
              </div>

              {/* Material List inside Module */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800">
                  Materi Dalam Modul ({contents.length})
                </h4>
                {contents.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Belum ada materi diunggah.</p>
                ) : (
                  contents.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400">
                            #{item.orderNumber}
                          </span>
                          <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">
                            {getContentTypeIcon(item.contentType)}
                          </div>
                          <span className="font-bold text-slate-800 text-xs">{item.title}</span>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {item.contentType}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 pl-8">{item.description}</p>
                      )}
                      {item.contentType === 'TEXT' && item.textContent && (
                        <div className="text-[10px] bg-slate-50 p-2 rounded text-slate-600 line-clamp-2 pl-8 font-mono">
                          {item.textContent}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* LIST VIEW */
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search size={13} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari judul modul, guru, kelas..."
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] font-semibold no-scrollbar">
                {[
                  { id: 'PENDING_REVIEW', label: `Perlu Review (${pendingCount})` },
                  { id: 'PUBLISHED', label: 'Published' },
                  { id: 'DRAFT', label: 'Draft' },
                  { id: 'ALL', label: 'Semua' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-full whitespace-nowrap border transition-all ${
                      statusFilter === tab.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Modules list */}
              {loading ? (
                <div className="text-center py-8 text-xs text-slate-400">Memuat modul...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <BookOpen size={24} className="mx-auto text-slate-400" />
                  <p className="text-xs font-bold text-slate-700">Tidak ada modul</p>
                  <p className="text-[11px] text-slate-500">
                    Tidak ada modul dengan filter yang dipilih saat ini.
                  </p>
                </div>
              ) : (
                filtered.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs space-y-2 hover:border-blue-300 transition"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                          {item.className}
                        </span>
                        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                          {item.subjectName}
                        </span>
                        {getStatusBadge(item.status)}
                      </div>
                      <button
                        onClick={() => loadModuleDetail(item)}
                        className="text-[11px] text-blue-600 hover:underline font-semibold flex items-center gap-0.5"
                      >
                        <span>Lihat Detail</span>
                        <ChevronRight size={12} />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Guru: <strong className="text-slate-700">{item.teacherName}</strong> •{' '}
                        {item.totalContents || 0} Materi
                      </p>
                    </div>

                    {/* Quick review action if PENDING */}
                    {item.status === 'PENDING_REVIEW' && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'DRAFT')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                          Tolak (Draft)
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(item.id, 'PUBLISHED')}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                        >
                          Setujui & Publikasikan
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
