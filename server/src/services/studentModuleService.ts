import { prisma } from '../utils/prisma';

export class StudentModuleService {
  /**
   * Helper: Mengambil data Student dan Kelas aktifnya berdasarkan userId dari JWT
   */
  static async getStudentAndActiveClasses(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: { user: { select: { name: true, email: true } } },
    });

    if (!student) {
      const error: any = new Error('Data profil siswa tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    // Ambil tahun ajaran yang sedang aktif
    const activeYear = await (prisma as any).academicYear.findFirst({
      where: { isActive: true },
    });

    if (!activeYear) {
      return { student, activeYear: null, classIds: [] };
    }

    // Ambil kelas aktif siswa pada tahun ajaran ini
    const enrollments = await (prisma as any).classStudent.findMany({
      where: {
        studentId: student.id,
        class: {
          academicYearId: activeYear.id,
          isActive: true,
        },
      },
      include: {
        class: true,
      },
    });

    const classIds = enrollments.map((e: any) => e.classId);

    return {
      student,
      activeYear,
      classIds,
      enrollments,
    };
  }

  /**
   * Mengambil daftar Modul PUBLISHED untuk kelas siswa pada tahun ajaran aktif
   */
  static async getStudentModules(userId: string, query: { search?: string; subjectId?: string }) {
    const { student, activeYear, classIds } = await this.getStudentAndActiveClasses(userId);

    if (!activeYear || classIds.length === 0) {
      return {
        modules: [],
        activeYear: activeYear ? { id: activeYear.id, name: activeYear.name } : null,
      };
    }

    const where: any = {
      status: 'PUBLISHED',
      classId: { in: classIds },
      academicYearId: activeYear.id,
    };

    if (query.subjectId) {
      where.subjectId = query.subjectId;
    }

    if (query.search && query.search.trim() !== '') {
      const search = query.search.trim();
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { name: { contains: search, mode: 'insensitive' } } },
        { teacher: { user: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    const modules = await (prisma as any).module.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        subject: true,
        class: true,
        teacher: {
          include: {
            user: { select: { name: true, avatar: true } },
          },
        },
        contents: {
          select: { id: true },
        },
      },
    });

    // Ambil semua progress siswa untuk modul-modul ini secara efisien
    const moduleIds = modules.map((m: any) => m.id);
    const progressList = await (prisma as any).moduleProgress.findMany({
      where: {
        studentId: student.id,
        moduleId: { in: moduleIds },
        isCompleted: true,
      },
    });

    // Petakan completed count per moduleId
    const completedMap: Record<string, number> = {};
    for (const p of progressList) {
      completedMap[p.moduleId] = (completedMap[p.moduleId] || 0) + 1;
    }

    const result = modules.map((m: any) => {
      const totalContents = m.contents.length;
      const completedContents = completedMap[m.id] || 0;
      const percentage = totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0;

      return {
        id: m.id,
        title: m.title,
        description: m.description,
        learningObjectives: m.learningObjectives,
        thumbnailUrl: m.thumbnailUrl,
        subjectId: m.subjectId,
        subjectName: m.subject.name,
        subjectCode: m.subject.code,
        classId: m.classId,
        className: m.class.name,
        teacherName: m.teacher.user.name,
        teacherAvatar: m.teacher.user.avatar,
        publishedAt: m.publishedAt,
        totalContents,
        completedContents,
        percentage,
      };
    });

    return {
      modules: result,
      activeYear: { id: activeYear.id, name: activeYear.name },
    };
  }

  /**
   * Mengambil detail Modul untuk Siswa beserta materi dan status penyelesaiannya
   */
  static async getStudentModuleDetail(userId: string, moduleId: string) {
    const { student, classIds } = await this.getStudentAndActiveClasses(userId);

    const foundModule = await (prisma as any).module.findUnique({
      where: { id: moduleId },
      include: {
        subject: true,
        class: true,
        teacher: {
          include: {
            user: { select: { name: true, avatar: true, email: true } },
          },
        },
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

    if (foundModule.status !== 'PUBLISHED') {
      const error: any = new Error('Modul ini belum dipublikasikan untuk siswa.');
      error.statusCode = 403;
      throw error;
    }

    if (!classIds.includes(foundModule.classId)) {
      const error: any = new Error('Akses ditolak. Modul ini bukan untuk kelas Anda.');
      error.statusCode = 403;
      throw error;
    }

    // Ambil daftar progress siswa untuk materi di modul ini
    const progressList = await (prisma as any).moduleProgress.findMany({
      where: {
        studentId: student.id,
        moduleId: foundModule.id,
      },
    });

    const progressMap = new Map<string, { isCompleted: boolean; completedAt: Date | null }>();
    for (const p of progressList) {
      progressMap.set(p.moduleContentId, {
        isCompleted: p.isCompleted,
        completedAt: p.completedAt,
      });
    }

    const contentsWithProgress = foundModule.contents.map((c: any) => {
      const prog = progressMap.get(c.id);
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        contentType: c.contentType,
        textContent: c.textContent,
        fileUrl: c.fileUrl,
        videoUrl: c.videoUrl,
        imageUrl: c.imageUrl,
        orderNumber: c.orderNumber,
        isCompleted: prog ? prog.isCompleted : false,
        completedAt: prog ? prog.completedAt : null,
      };
    });

    const totalContents = contentsWithProgress.length;
    const completedContents = contentsWithProgress.filter((c: any) => c.isCompleted).length;
    const percentage = totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0;

    return {
      id: foundModule.id,
      title: foundModule.title,
      description: foundModule.description,
      learningObjectives: foundModule.learningObjectives,
      thumbnailUrl: foundModule.thumbnailUrl,
      subjectName: foundModule.subject.name,
      subjectCode: foundModule.subject.code,
      className: foundModule.class.name,
      teacherName: foundModule.teacher.user.name,
      teacherAvatar: foundModule.teacher.user.avatar,
      publishedAt: foundModule.publishedAt,
      totalContents,
      completedContents,
      percentage,
      contents: contentsWithProgress,
    };
  }

  /**
   * Menghitung progres Modul Siswa secara langsung dari database
   */
  static async getModuleProgress(userId: string, moduleId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      const error: any = new Error('Data profil siswa tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    const [totalContents, completedContents] = await Promise.all([
      (prisma as any).moduleContent.count({
        where: { moduleId },
      }),
      (prisma as any).moduleProgress.count({
        where: {
          moduleId,
          studentId: student.id,
          isCompleted: true,
        },
      }),
    ]);

    const percentage = totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0;

    return {
      totalContents,
      completedContents,
      percentage,
    };
  }

  /**
   * Menandai Materi selesai oleh Siswa
   */
  static async completeContent(userId: string, contentId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      const error: any = new Error('Data profil siswa tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    // Ambil konten beserta modulnya
    const content = await (prisma as any).moduleContent.findUnique({
      where: { id: contentId },
      include: {
        module: true,
      },
    });

    if (!content) {
      const error: any = new Error('Materi modul tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    if (content.module.status !== 'PUBLISHED') {
      const error: any = new Error('Modul ini belum dipublikasikan.');
      error.statusCode = 403;
      throw error;
    }

    // Pastikan siswa terdaftar di kelas modul ini
    const enrollment = await (prisma as any).classStudent.findUnique({
      where: {
        classId_studentId: {
          classId: content.module.classId,
          studentId: student.id,
        },
      },
    });

    if (!enrollment) {
      const error: any = new Error('Akses ditolak. Anda tidak terdaftar di kelas untuk modul ini.');
      error.statusCode = 403;
      throw error;
    }

    // Upsert progress
    const progress = await (prisma as any).moduleProgress.upsert({
      where: {
        studentId_moduleContentId: {
          studentId: student.id,
          moduleContentId: contentId,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        studentId: student.id,
        moduleId: content.moduleId,
        moduleContentId: contentId,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    // Ambil statistik progres terbaru
    const stats = await this.getModuleProgress(userId, content.moduleId);

    return {
      progress,
      stats,
    };
  }

  /**
   * Membatalkan tanda selesai Materi oleh Siswa
   */
  static async uncompleteContent(userId: string, contentId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
    });

    if (!student) {
      const error: any = new Error('Data profil siswa tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    const content = await (prisma as any).moduleContent.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      const error: any = new Error('Materi modul tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    await (prisma as any).moduleProgress.deleteMany({
      where: {
        studentId: student.id,
        moduleContentId: contentId,
      },
    });

    // Ambil statistik progres terbaru
    const stats = await this.getModuleProgress(userId, content.moduleId);

    return {
      message: 'Materi ditandai belum selesai.',
      stats,
    };
  }

  /**
   * Mengambil Profil Lengkap Siswa BISA (Tahap 4.5)
   */
  static async getProfile(userId: string) {
    const userDoc = await prisma.user.findUnique({ where: { id: userId } });
    const student = await (prisma as any).student.findFirst({
      where: {
        OR: [
          { userId },
          ...(userDoc?.email ? [{ email: userDoc.email }] : [])
        ]
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        classes: {
          include: {
            class: {
              include: {
                academicYear: true,
                homeroomTeacher: {
                  include: {
                    user: { select: { name: true } }
                  }
                }
              }
            }
          }
        },
        moduleProgress: true,
      }
    });

    if (!student) {
      const error: any = new Error('Data profil siswa tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    const currentEnrollment = student.classes?.[0];
    const currentClass = currentEnrollment?.class;

    return {
      id: student.id,
      name: student.user?.name || student.email?.split('@')[0],
      email: student.email || student.user?.email,
      studentNumber: student.studentNumber,
      nisn: student.nisn,
      profilePhotoUrl: student.profilePhotoUrl || student.user?.avatar,
      authProvider: student.authProvider,
      status: student.status,
      class: currentClass ? {
        id: currentClass.id,
        name: currentClass.name,
        grade: currentClass.grade,
        academicYear: currentClass.academicYear?.name,
        homeroomTeacher: currentClass.homeroomTeacher?.user?.name || null,
      } : null,
      totalCompletedMaterials: student.moduleProgress?.length || 0,
    };
  }
}
