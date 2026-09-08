import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  FileCheck,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Search,
  ExternalLink,
  Award,
  ChevronRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { User, ModuleItem, ModuleContent, ContentType } from '../types';
import { moduleApi } from '../mockApi';

interface StudentModuleTabProps {
  user: User;
}

export const StudentModuleTab: React.FC<StudentModuleTabProps> = ({ user }) => {
  const studentId = user.student?.id || 'std-01';

  const [modules, setModules] = useState<ModuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Active module reader
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [activeModule, setActiveModule] = useState<ModuleItem | null>(null);
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadModules = async () => {
    try {
      setLoading(true);
      const list = await moduleApi.getStudentModules(studentId);
      setModules(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, [studentId]);

  const loadModuleDetail = async (id: string) => {
    try {
      const detail = await moduleApi.getStudentModuleDetail(studentId, id);
      setActiveModule(detail);
      if (detail.contents && detail.contents.length > 0 && !selectedContentId) {
        setSelectedContentId(detail.contents[0].id);
      }
    } catch (err: any) {
      alert(err.message || 'Gagal memuat modul');
    }
  };

  useEffect(() => {
    if (activeModuleId) {
      loadModuleDetail(activeModuleId);
    } else {
      setActiveModule(null);
      setSelectedContentId(null);
    }
  }, [activeModuleId]);

  const handleToggleComplete = async (contentId: string, currentStatus: boolean) => {
    if (!activeModule) return;
    try {
      setTogglingId(contentId);
      const nextStatus = !currentStatus;
      const res = await moduleApi.toggleContentProgress(
        studentId,
        activeModule.id,
        contentId,
        nextStatus
      );

      // Update local state
      setActiveModule((prev) => {
        if (!prev) return null;
        const newContents = (prev.contents || []).map((c) =>
          c.id === contentId
            ? { ...c, isCompleted: res.isCompleted, completedAt: res.completedAt }
            : c
        );
        return {
          ...prev,
          contents: newContents,
          completedContents: res.stats.completed,
          totalContents: res.stats.total,
          percentage: res.stats.percentage,
        };
      });

      // Also refresh background list
      loadModules();
    } catch (err: any) {
      alert(err.message || 'Gagal mengubah status penyelesaian materi');
    } finally {
      setTogglingId(null);
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

  const filteredModules = modules.filter((m) => {
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        m.title.toLowerCase().includes(q) ||
        (m.subjectName && m.subjectName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // RENDER: MODULE READER / LEARNING VIEW
  if (activeModuleId && activeModule) {
    const contents = activeModule.contents || [];
    const activeContent = contents.find((c) => c.id === selectedContentId) || contents[0];
    const isAllCompleted = activeModule.percentage === 100;

    return (
      <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-4">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveModuleId(null)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Daftar Modul</span>
          </button>
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            {activeModule.subjectName}
          </span>
        </div>

        {/* Module Header Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 leading-snug">{activeModule.title}</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Guru Pengampu: <strong className="text-slate-700">{activeModule.teacherName}</strong>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                {isAllCompleted ? (
                  <CheckCircle2 size={14} className="text-emerald-600" />
                ) : (
                  <Clock size={14} className="text-sky-600" />
                )}
                Progres Pembelajaran
              </span>
              <span className="font-bold text-sky-700">{activeModule.percentage || 0}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isAllCompleted ? 'bg-emerald-500' : 'bg-sky-600'
                }`}
                style={{ width: `${activeModule.percentage || 0}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">
              {activeModule.completedContents || 0} dari {activeModule.totalContents || 0} materi telah diselesaikan.
            </p>
          </div>

          {isAllCompleted && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-xs flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-600 shrink-0" />
              <span>Hebat! Anda telah menyelesaikan seluruh materi dalam modul pembelajaran ini.</span>
            </div>
          )}
        </div>

        {/* Content Viewer */}
        {activeContent && (
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getContentTypeIcon(activeContent.contentType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">
                      Materi #{activeContent.orderNumber}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                      {activeContent.contentType}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">{activeContent.title}</h3>
                </div>
              </div>

              {/* Toggle Complete Button */}
              <button
                disabled={togglingId === activeContent.id}
                onClick={() => handleToggleComplete(activeContent.id, !!activeContent.isCompleted)}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                  activeContent.isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {activeContent.isCompleted ? (
                  <>
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span>Selesai</span>
                  </>
                ) : (
                  <>
                    <Circle size={14} className="text-slate-400" />
                    <span>Tandai Selesai</span>
                  </>
                )}
              </button>
            </div>

            {/* Render Material Body based on ContentType */}
            <div className="py-2">
              {activeContent.contentType === 'TEXT' && (
                <div className="prose prose-xs max-w-none text-slate-800">
                  <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                    {activeContent.textContent}
                  </div>
                </div>
              )}

              {activeContent.contentType === 'DOCUMENT' && (
                <div className="bg-purple-50/50 rounded-xl p-4 border border-purple-100 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
                    <FileCheck size={24} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {activeContent.fileUrl?.split('/').pop() || 'Dokumen Materi.pdf'}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Format dokumen resmi kurikulum untuk dipelajari mandiri.
                    </p>
                  </div>
                  <a
                    href={activeContent.fileUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition"
                  >
                    <span>Buka / Unduh Dokumen</span>
                    <ExternalLink size={13} />
                  </a>
                </div>
              )}

              {activeContent.contentType === 'VIDEO' && (
                <div className="space-y-2">
                  <div className="rounded-xl overflow-hidden bg-slate-900 aspect-video flex flex-col items-center justify-center text-white p-4 text-center">
                    <Video size={36} className="text-rose-500 mb-2" />
                    <p className="text-xs font-semibold">Video Kuliah & Pembahasan</p>
                    <p className="text-[10px] text-slate-400 max-w-xs truncate mt-1">
                      {activeContent.videoUrl}
                    </p>
                    <a
                      href={activeContent.videoUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg"
                    >
                      <span>Tonton di Tautan Video</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              )}

              {activeContent.contentType === 'IMAGE' && activeContent.imageUrl && (
                <div className="space-y-2">
                  <div className="rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={activeContent.imageUrl}
                      alt={activeContent.title}
                      className="w-full max-h-72 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Playlist of Materials */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-800">Daftar Materi Modul</h3>
          <div className="space-y-1.5">
            {contents.map((item) => {
              const isSelected = selectedContentId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedContentId(item.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-50 border-sky-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(item.id, !!item.isCompleted);
                      }}
                      className="text-slate-400 hover:text-emerald-600"
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      ) : (
                        <Circle size={16} />
                      )}
                    </button>
                    <div>
                      <h4
                        className={`text-xs font-bold leading-tight ${
                          item.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-500">{item.contentType}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-400 shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // RENDER: STUDENT MODULES LIST
  return (
    <div className="flex-1 w-full bg-slate-50 flex flex-col p-4 overflow-y-auto space-y-3.5">
      {/* Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <h3 className="text-xs font-bold text-slate-900">Materi Pembelajaran</h3>
        <p className="text-[11px] text-slate-500">Modul aktif kelas Anda semester ini</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari modul atau mata pelajaran..."
          className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
        />
      </div>

      {/* Modules List */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Memuat modul pembelajaran...</div>
        ) : filteredModules.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <BookOpen size={20} />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Belum Ada Modul Aktif</h4>
            <p className="text-[11px] text-slate-500">
              Modul pembelajaran yang diterbitkan oleh guru pengajar akan muncul di sini.
            </p>
          </div>
        ) : (
          filteredModules.map((item) => {
            const isCompleted = item.percentage === 100;

            return (
              <div
                key={item.id}
                onClick={() => setActiveModuleId(item.id)}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:border-sky-300 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {item.subjectName}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-sky-50 text-sky-700 border border-sky-200'
                    }`}
                  >
                    {item.percentage || 0}% Selesai
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Oleh: <span className="font-semibold text-slate-700">{item.teacherName}</span>
                  </p>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isCompleted ? 'bg-emerald-500' : 'bg-sky-600'
                      }`}
                      style={{ width: `${item.percentage || 0}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>
                      {item.completedContents || 0} / {item.totalContents || 0} Materi
                    </span>
                    <span className="text-sky-600 font-semibold flex items-center gap-0.5">
                      Buka Modul
                      <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
