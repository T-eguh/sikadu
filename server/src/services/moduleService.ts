import { prisma } from '../utils/prisma';
import { ModuleStatus } from '../types';

interface GetModulesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: ModuleStatus;
  teacherId?: string;
  classId?: string;
  subjectId?: string;
  academicYearId?: string;
}

export class ModuleService {
  /**
   * Mengambil semua modul untuk Admin dengan berbagai filter & pagination
   */
  static async getAllModules(query: GetModulesQuery) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.teacherId) {
      where.teacherId = query.teacherId;
    }

    if (query.classId) {
      where.classId = query.classId;
    }

    if (query.subjectId) {
      where.subjectId = query.subjectId;
    }

    if (query.academicYearId) {
      where.academicYearId = query.academicYearId;
    }

    if (query.search && query.search.trim() !== '') {
      const search = query.search.trim();
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { name: { contains: search, mode: 'insensitive' } } },
        { class: { name: { contains: search, mode: 'insensitive' } } },
        { teacher: { user: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const [total, modules] = await Promise.all([
      (prisma as any).module.count({ where }),
      (prisma as any).module.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          teacher: {
            include: {
              user: {
                select: { id: true, name: true, email: true, avatar: true },
              },
            },
          },
          class: {
            select: { id: true, name: true, grade: true },
          },
          subject: {
            select: { id: true, name: true, code: true },
          },
          academicYear: {
            select: { id: true, name: true, isActive: true },
          },
          _count: {
            select: { contents: true },
          },
        },
      }),
    ]);

    return {
      data: modules.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        learningObjectives: m.learningObjectives,
        thumbnailUrl: m.thumbnailUrl,
        status: m.status,
        teacherId: m.teacherId,
        teacherName: m.teacher.user.name,
        teacherEmail: m.teacher.user.email,
        teacherAvatar: m.teacher.user.avatar,
        classId: m.classId,
        className: m.class.name,
        classGrade: m.class.grade,
        subjectId: m.subjectId,
        subjectName: m.subject.name,
        subjectCode: m.subject.code,
        academicYearId: m.academicYearId,
        academicYearName: m.academicYear.name,
        totalContents: m._count.contents,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        publishedAt: m.publishedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Mengambil modul milik Guru yang sedang login
   */
  static async getMyModules(userId: string, query: { page?: number; limit?: number; search?: string; status?: ModuleStatus }) {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      const error: any = new Error('Profil guru tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: any = {
      teacherId: teacher.id,
    };

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim() !== '') {
      const search = query.search.trim();
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { name: { contains: search, mode: 'insensitive' } } },
        { class: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [total, modules] = await Promise.all([
      (prisma as any).module.count({ where }),
      (prisma as any).module.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          class: {
            select: { id: true, name: true, grade: true },
          },
          subject: {
            select: { id: true, name: true, code: true },
          },
          academicYear: {
            select: { id: true, name: true, isActive: true },
          },
          _count: {
            select: { contents: true },
          },
        },
      }),
    ]);

    return {
      data: modules.map((m: any) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        learningObjectives: m.learningObjectives,
        thumbnailUrl: m.thumbnailUrl,
        status: m.status,
        teachingAssignmentId: m.teachingAssignmentId,
        classId: m.classId,
        className: m.class.name,
        classGrade: m.class.grade,
        subjectId: m.subjectId,
        subjectName: m.subject.name,
        subjectCode: m.subject.code,
        academicYearId: m.academicYearId,
        academicYearName: m.academicYear.name,
        totalContents: m._count.contents,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
        publishedAt: m.publishedAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Membuat Modul baru oleh Guru
   * Validasi ketat: Guru harus memilih teachingAssignmentId miliknya sendiri.
   * Data classId, subjectId, academicYearId diambil otomatis dari database.
   */
  static async createModule(
    userId: string,
    input: {
      title: string;
      description?: string;
      learningObjectives: string;
      teachingAssignmentId: string;
      thumbnailUrl?: string;
    }
  ) {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      const error: any = new Error('Hanya guru yang berwenang membuat modul pembelajaran.');
      error.statusCode = 403;
      throw error;
    }

    // Validasi bahwa teaching assignment benar-benar ada dan milik Guru ini
    const assignment = await (prisma as any).teachingAssignment.findUnique({
      where: { id: input.teachingAssignmentId },
      include: {
        class: true,
        subject: true,
        academicYear: true,
      },
    });

    if (!assignment) {
      const error: any = new Error('Penugasan mengajar tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    if (assignment.teacherId !== teacher.id) {
      const error: any = new Error(
        'Akses ditolak. Anda hanya dapat membuat modul untuk penugasan mengajar milik Anda sendiri.'
      );
      error.statusCode = 403;
      throw error;
    }

    // Buat modul dengan status awal DRAFT
    const newModule = await (prisma as any).module.create({
      data: {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        learningObjectives: input.learningObjectives.trim(),
        thumbnailUrl: input.thumbnailUrl || null,
        status: 'DRAFT',
        teacherId: teacher.id,
        teachingAssignmentId: assignment.id,
        classId: assignment.classId,
        subjectId: assignment.subjectId,
        academicYearId: assignment.academicYearId,
      },
      include: {
        class: true,
        subject: true,
        academicYear: true,
      },
    });

    return newModule;
  }

  /**
   * Mengambil detail Modul berdasarkan ID (dengan otorisasi)
   */
  static async getModuleById(moduleId: string, user: { id: string; role: string }) {
    const foundModule = await (prisma as any).module.findUnique({
      where: { id: moduleId },
      include: {
        teacher: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        class: true,
        subject: true,
        academicYear: true,
        contents: {
          orderBy: { orderNumber: 'asc' },
        },
      },
    });

    if (!foundModule) {
      const error: any = new Error('Modul pembelajaran tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    // Hak akses:
    // Admin dapat melihat semua
    // Guru dapat melihat miliknya
    // Siswa hanya dapat melihat jika status PUBLISHED dan berada di kelas yang sama
    if (user.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
      if (!teacher || teacher.id !== foundModule.teacherId) {
        const error: any = new Error('Akses ditolak. Anda tidak memiliki izin melihat modul ini.');
        error.statusCode = 403;
        throw error;
      }
    } else if (user.role === 'STUDENT') {
      if (foundModule.status !== 'PUBLISHED') {
        const error: any = new Error('Modul ini belum dipublikasikan untuk siswa.');
        error.statusCode = 403;
        throw error;
      }
      const student = await prisma.student.findUnique({ where: { userId: user.id } });
      if (!student) {
        const error: any = new Error('Data siswa tidak ditemukan.');
        error.statusCode = 404;
        throw error;
      }
      const isEnrolled = await (prisma as any).classStudent.findUnique({
        where: {
          classId_studentId: {
            classId: foundModule.classId,
            studentId: student.id,
          },
        },
      });
      if (!isEnrolled) {
        const error: any = new Error('Akses ditolak. Modul ini bukan untuk kelas Anda.');
        error.statusCode = 403;
        throw error;
      }
    }

    return foundModule;
  }

  /**
   * Mengedit Modul oleh Guru
   * Aturan: Guru hanya dapat mengubah Judul, Deskripsi, Tujuan Pembelajaran, Thumbnail.
   * Jika modul berstatus PUBLISHED diedit oleh Guru, otomatis dikembalikan ke DRAFT.
   */
  static async updateModule(
    moduleId: string,
    userId: string,
    input: {
      title?: string;
      description?: string;
      learningObjectives?: string;
      thumbnailUrl?: string;
    }
  ) {
    const teacher = await prisma.teacher.findUnique({ where: { userId } });
    if (!teacher) {
      const error: any = new Error('Hanya guru yang berwenang mengedit modul.');
      error.statusCode = 403;
      throw error;
    }

    const existing = await (prisma as any).module.findUnique({ where: { id: moduleId } });
    if (!existing) {
      const error: any = new Error('Modul pembelajaran tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    if (existing.teacherId !== teacher.id) {
      const error: any = new Error('Akses ditolak. Anda bukan pemilik modul ini.');
      error.statusCode = 403;
      throw error;
    }

    // Aturan: Jika modul yang sudah PUBLISHED diubah, kembalikan status ke DRAFT
    const shouldRevertToDraft = existing.status === 'PUBLISHED';

    const updated = await (prisma as any).module.update({
      where: { id: moduleId },
      data: {
        ...(input.title ? { title: input.title.trim() } : {}),
        ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
        ...(input.learningObjectives ? { learningObjectives: input.learningObjectives.trim() } : {}),
        ...(input.thumbnailUrl !== undefined ? { thumbnailUrl: input.thumbnailUrl || null } : {}),
        ...(shouldRevertToDraft ? { status: 'DRAFT', publishedAt: null } : {}),
      },
      include: {
        class: true,
        subject: true,
        academicYear: true,
      },
    });

    return {
      module: updated,
      revertedToDraft: shouldRevertToDraft,
    };
  }

  /**
   * Mengubah Status Modul
   * Aturan:
   * - Guru: dapat mengubah DRAFT -> PENDING_REVIEW (atau kembali ke DRAFT jika belum dipublish).
   *   Guru TIDAK BOLEH mempublish sendiri tanpa review!
   * - Admin: dapat mengubah PENDING_REVIEW -> PUBLISHED atau DRAFT.
   */
  static async updateModuleStatus(
    moduleId: string,
    user: { id: string; role: string },
    newStatus: ModuleStatus,
    reviewNote?: string
  ) {
    const existing = await (prisma as any).module.findUnique({ where: { id: moduleId } });
    if (!existing) {
      const error: any = new Error('Modul pembelajaran tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
      if (!teacher || teacher.id !== existing.teacherId) {
        const error: any = new Error('Akses ditolak. Anda bukan pemilik modul ini.');
        error.statusCode = 403;
        throw error;
      }

      // Teacher hanya boleh DRAFT -> PENDING_REVIEW atau kembali ke DRAFT
      if (newStatus === 'PUBLISHED') {
        const error: any = new Error(
          'Guru tidak dapat mempublikasikan modul secara langsung. Silakan kirim untuk Review Administrator terlebih dahulu.'
        );
        error.statusCode = 403;
        throw error;
      }

      if (!['DRAFT', 'PENDING_REVIEW', 'ARCHIVED'].includes(newStatus)) {
        const error: any = new Error('Status tidak valid untuk aksi guru.');
        error.statusCode = 400;
        throw error;
      }
    } else if (user.role === 'ADMIN') {
      // Admin dapat mengubah ke PUBLISHED, DRAFT, PENDING_REVIEW, atau ARCHIVED
      if (!['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED'].includes(newStatus)) {
        const error: any = new Error('Status tidak valid.');
        error.statusCode = 400;
        throw error;
      }
    } else {
      const error: any = new Error('Anda tidak memiliki izin mengubah status modul.');
      error.statusCode = 403;
      throw error;
    }

    const updated = await (prisma as any).module.update({
      where: { id: moduleId },
      data: {
        status: newStatus,
        publishedAt: newStatus === 'PUBLISHED' ? new Date() : (newStatus === 'DRAFT' ? null : existing.publishedAt),
      },
      include: {
        teacher: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        class: true,
        subject: true,
      },
    });

    return {
      module: updated,
      reviewNote,
    };
  }

  /**
   * Menghapus Modul (Guru pemilik atau Admin)
   */
  static async deleteModule(moduleId: string, user: { id: string; role: string }) {
    const existing = await (prisma as any).module.findUnique({
      where: { id: moduleId },
      include: { contents: true },
    });

    if (!existing) {
      const error: any = new Error('Modul pembelajaran tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
      if (!teacher || teacher.id !== existing.teacherId) {
        const error: any = new Error('Akses ditolak. Anda bukan pemilik modul ini.');
        error.statusCode = 403;
        throw error;
      }
    }

    await (prisma as any).module.delete({
      where: { id: moduleId },
    });

    return { message: 'Modul pembelajaran berhasil dihapus.' };
  }
}
