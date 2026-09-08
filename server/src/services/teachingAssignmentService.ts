import { prisma } from '../utils/prisma';

export interface GetTeachingAssignmentsQuery {
  teacherId?: string;
  classId?: string;
  subjectId?: string;
  academicYearId?: string;
  page?: number;
  limit?: number;
}

export interface CreateTeachingAssignmentInput {
  teacherId: string;
  classId: string;
  subjectId: string;
  academicYearId: string;
}

export interface UpdateTeachingAssignmentInput {
  teacherId?: string;
  classId?: string;
  subjectId?: string;
  academicYearId?: string;
}

export class TeachingAssignmentService {
  static async getTeachingAssignments(query: GetTeachingAssignmentsQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.teacherId) where.teacherId = query.teacherId;
    if (query.classId) where.classId = query.classId;
    if (query.subjectId) where.subjectId = query.subjectId;
    if (query.academicYearId) where.academicYearId = query.academicYearId;

    const [total, assignments] = await Promise.all([
      (prisma as any).teachingAssignment.count({ where }),
      (prisma as any).teachingAssignment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: {
            include: {
              user: {
                select: { id: true, name: true, email: true, avatar: true, isActive: true },
              },
            },
          },
          class: {
            include: {
              academicYear: { select: { id: true, name: true, isActive: true } },
              _count: { select: { students: true } },
            },
          },
          subject: true,
          academicYear: true,
        },
      }),
    ]);

    return {
      data: assignments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getTeachingAssignmentById(id: string) {
    const assignment = await (prisma as any).teachingAssignment.findUnique({
      where: { id },
      include: {
        teacher: {
          include: {
            user: { select: { id: true, name: true, email: true, avatar: true, isActive: true } },
          },
        },
        class: {
          include: {
            academicYear: true,
            students: {
              include: {
                student: {
                  include: { user: { select: { id: true, name: true, email: true } } },
                },
              },
            },
          },
        },
        subject: true,
        academicYear: true,
      },
    });

    if (!assignment) {
      const error = new Error('Penugasan mengajar tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    return assignment;
  }

  static async createTeachingAssignment(input: CreateTeachingAssignmentInput) {
    // 1. Verify Teacher exists and is active
    const teacher = await prisma.teacher.findUnique({
      where: { id: input.teacherId },
      include: { user: true },
    });
    if (!teacher || !teacher.user.isActive) {
      const error = new Error('Guru tidak ditemukan atau status akun tidak aktif');
      (error as any).statusCode = 400;
      throw error;
    }

    // 2. Verify Class exists and is active
    const cls = await (prisma as any).class.findUnique({
      where: { id: input.classId },
    });
    if (!cls || !cls.isActive) {
      const error = new Error('Kelas tidak ditemukan atau status kelas tidak aktif');
      (error as any).statusCode = 400;
      throw error;
    }

    // 3. Verify Subject exists and is active
    const subject = await (prisma as any).subject.findUnique({
      where: { id: input.subjectId },
    });
    if (!subject || !subject.isActive) {
      const error = new Error('Mata pelajaran tidak ditemukan atau status tidak aktif');
      (error as any).statusCode = 400;
      throw error;
    }

    // 4. Verify AcademicYear exists
    const academicYear = await (prisma as any).academicYear.findUnique({
      where: { id: input.academicYearId },
    });
    if (!academicYear) {
      const error = new Error('Tahun ajaran tidak valid');
      (error as any).statusCode = 400;
      throw error;
    }

    // 5. Check Duplicate Constraint
    const existing = await (prisma as any).teachingAssignment.findFirst({
      where: {
        teacherId: input.teacherId,
        classId: input.classId,
        subjectId: input.subjectId,
        academicYearId: input.academicYearId,
      },
    });

    if (existing) {
      const error = new Error(
        'Penugasan mengajar untuk guru, kelas, mata pelajaran, dan tahun ajaran ini sudah ada.'
      );
      (error as any).statusCode = 409;
      throw error;
    }

    return (prisma as any).teachingAssignment.create({
      data: {
        teacherId: input.teacherId,
        classId: input.classId,
        subjectId: input.subjectId,
        academicYearId: input.academicYearId,
      },
      include: {
        teacher: { include: { user: { select: { id: true, name: true, email: true } } } },
        class: { select: { id: true, name: true, grade: true } },
        subject: true,
        academicYear: true,
      },
    });
  }

  static async updateTeachingAssignment(id: string, input: UpdateTeachingAssignmentInput) {
    const existing = await (prisma as any).teachingAssignment.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Penugasan mengajar tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    const teacherId = input.teacherId || existing.teacherId;
    const classId = input.classId || existing.classId;
    const subjectId = input.subjectId || existing.subjectId;
    const academicYearId = input.academicYearId || existing.academicYearId;

    // Check duplicate if values changed
    if (
      teacherId !== existing.teacherId ||
      classId !== existing.classId ||
      subjectId !== existing.subjectId ||
      academicYearId !== existing.academicYearId
    ) {
      const duplicate = await (prisma as any).teachingAssignment.findFirst({
        where: {
          id: { not: id },
          teacherId,
          classId,
          subjectId,
          academicYearId,
        },
      });
      if (duplicate) {
        const error = new Error(
          'Penugasan mengajar untuk kombinasi guru, kelas, mata pelajaran, dan tahun ajaran ini sudah ada.'
        );
        (error as any).statusCode = 409;
        throw error;
      }
    }

    return (prisma as any).teachingAssignment.update({
      where: { id },
      data: {
        teacherId,
        classId,
        subjectId,
        academicYearId,
      },
      include: {
        teacher: { include: { user: { select: { id: true, name: true, email: true } } } },
        class: { select: { id: true, name: true, grade: true } },
        subject: true,
        academicYear: true,
      },
    });
  }

  static async deleteTeachingAssignment(id: string) {
    const existing = await (prisma as any).teachingAssignment.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Penugasan mengajar tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    await (prisma as any).teachingAssignment.delete({ where: { id } });
    return { message: 'Penugasan mengajar berhasil dihapus' };
  }
}
