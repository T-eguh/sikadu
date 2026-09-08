import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { hashPassword } from '../utils/hash';

export interface GetTeachersQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateTeacherInput {
  name: string;
  email: string;
  teacherNumber: string;
  password: string;
  avatar?: string;
}

export interface UpdateTeacherInput {
  name?: string;
  email?: string;
  teacherNumber?: string;
  avatar?: string;
}

export class TeacherService {
  static async getTeachers(query: GetTeachersQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where: Prisma.UserWhereInput = {
      role: 'TEACHER',
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              {
                teacher: {
                  teacherNumber: { contains: search, mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
    };

    const [total, teachers] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          teacher: {
            select: {
              id: true,
              teacherNumber: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: teachers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getTeacherById(id: string) {
    const teacher = await prisma.user.findFirst({
      where: {
        id,
        role: 'TEACHER',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        teacher: {
          select: {
            id: true,
            teacherNumber: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!teacher) {
      const error: any = new Error('Data guru tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    return teacher;
  }

  static async createTeacher(input: CreateTeacherInput) {
    const emailNormalized = input.email.toLowerCase().trim();
    const teacherNumberNormalized = input.teacherNumber.trim();

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });
    if (existingUser) {
      const error: any = new Error('Email sudah terdaftar dalam sistem.');
      error.statusCode = 409;
      throw error;
    }

    // Check duplicate NIP
    const existingTeacherNumber = await prisma.teacher.findUnique({
      where: { teacherNumber: teacherNumberNormalized },
    });
    if (existingTeacherNumber) {
      const error: any = new Error('Nomor Induk Guru (NIP) sudah terdaftar dalam sistem.');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(input.password);

    // Atomic Prisma Transaction
    const newTeacher = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.name.trim(),
          email: emailNormalized,
          password: hashedPassword,
          role: 'TEACHER',
          avatar: input.avatar || null,
          isActive: true,
          teacher: {
            create: {
              teacherNumber: teacherNumberNormalized,
            },
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          teacher: {
            select: {
              id: true,
              teacherNumber: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return user;
    });

    return newTeacher;
  }

  static async updateTeacher(id: string, input: UpdateTeacherInput) {
    const existing = await prisma.user.findFirst({
      where: { id, role: 'TEACHER' },
      include: { teacher: true },
    });

    if (!existing || !existing.teacher) {
      const error: any = new Error('Data guru tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    // Check email uniqueness if modified
    if (input.email && input.email.toLowerCase().trim() !== existing.email.toLowerCase().trim()) {
      const emailConflict = await prisma.user.findUnique({
        where: { email: input.email.toLowerCase().trim() },
      });
      if (emailConflict && emailConflict.id !== id) {
        const error: any = new Error('Email sudah digunakan oleh akun lain.');
        error.statusCode = 409;
        throw error;
      }
    }

    // Check teacherNumber uniqueness if modified
    if (input.teacherNumber && input.teacherNumber.trim() !== existing.teacher.teacherNumber) {
      const nipConflict = await prisma.teacher.findUnique({
        where: { teacherNumber: input.teacherNumber.trim() },
      });
      if (nipConflict && nipConflict.userId !== id) {
        const error: any = new Error('Nomor Induk Guru (NIP) sudah digunakan.');
        error.statusCode = 409;
        throw error;
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (input.teacherNumber) {
        await tx.teacher.update({
          where: { userId: id },
          data: {
            teacherNumber: input.teacherNumber.trim(),
          },
        });
      }

      const user = await tx.user.update({
        where: { id },
        data: {
          ...(input.name ? { name: input.name.trim() } : {}),
          ...(input.email ? { email: input.email.toLowerCase().trim() } : {}),
          ...(input.avatar !== undefined ? { avatar: input.avatar } : {}),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          teacher: {
            select: {
              id: true,
              teacherNumber: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return user;
    });

    return updated;
  }

  static async updateStatus(id: string, isActive: boolean) {
    const existing = await prisma.user.findFirst({
      where: { id, role: 'TEACHER' },
    });

    if (!existing) {
      const error: any = new Error('Data guru tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        teacher: {
          select: {
            id: true,
            teacherNumber: true,
          },
        },
      },
    });

    return updated;
  }

  static async resetPassword(id: string, newPassword: string) {
    const existing = await prisma.user.findFirst({
      where: { id, role: 'TEACHER' },
    });

    if (!existing) {
      const error: any = new Error('Data guru tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return {
      message: 'Kata sandi guru berhasil diperbarui.',
    };
  }

  static async getMyClasses(userId: string) {
    const teacher = await prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      const error = new Error('Profil guru tidak ditemukan.');
      (error as any).statusCode = 404;
      throw error;
    }

    const assignments = await (prisma as any).teachingAssignment.findMany({
      where: {
        teacherId: teacher.id,
      },
      include: {
        class: {
          include: {
            academicYear: true,
            students: {
              include: {
                student: {
                  include: {
                    user: {
                      select: { id: true, name: true, email: true, avatar: true },
                    },
                  },
                },
              },
              orderBy: { createdAt: 'asc' },
            },
            _count: {
              select: { students: true },
            },
          },
        },
        subject: true,
        academicYear: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return assignments.map((a: any) => ({
      id: a.id,
      classId: a.classId,
      className: a.class.name,
      grade: a.class.grade,
      subjectId: a.subjectId,
      subjectName: a.subject.name,
      subjectCode: a.subject.code,
      academicYearId: a.academicYearId,
      academicYearName: a.academicYear.name,
      isAcademicYearActive: a.academicYear.isActive,
      totalStudents: a.class._count.students,
      students: a.class.students.map((cs: any) => ({
        id: cs.student.id,
        name: cs.student.user.name,
        email: cs.student.user.email,
        studentNumber: cs.student.studentNumber,
        nisn: cs.student.nisn,
        avatar: cs.student.user.avatar,
      })),
    }));
  }
}
