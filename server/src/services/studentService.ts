import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { hashPassword } from '../utils/hash';

export interface GetStudentsQuery {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateStudentInput {
  name: string;
  email: string;
  studentNumber: string; // NIS
  nisn: string; // NISN
  password: string;
  avatar?: string;
}

export interface UpdateStudentInput {
  name?: string;
  email?: string;
  studentNumber?: string;
  nisn?: string;
  avatar?: string;
}

export class StudentService {
  static async getStudents(query: GetStudentsQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where: Prisma.UserWhereInput = {
      role: 'STUDENT',
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              {
                student: {
                  studentNumber: { contains: search, mode: 'insensitive' },
                },
              },
              {
                student: {
                  nisn: { contains: search, mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
    };

    const [total, students] = await Promise.all([
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
          student: {
            select: {
              id: true,
              studentNumber: true,
              nisn: true,
              googleId: true,
              authProvider: true,
              status: true,
              profilePhotoUrl: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: students,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getStudentById(id: string) {
    const student = await prisma.user.findFirst({
      where: {
        id,
        role: 'STUDENT',
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
        student: {
          select: {
            id: true,
            studentNumber: true,
            nisn: true,
            googleId: true,
            authProvider: true,
            status: true,
            profilePhotoUrl: true,
            createdAt: true,
            updatedAt: true,
            classes: {
              include: {
                class: {
                  include: {
                    academicYear: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      const error: any = new Error('Data siswa tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    return student;
  }

  static async createStudent(input: CreateStudentInput) {
    const emailNormalized = input.email.toLowerCase().trim();
    const studentNumberNormalized = input.studentNumber.trim();
    const nisnNormalized = input.nisn.trim();

    // Check duplicate email
    const existingEmail = await prisma.user.findUnique({
      where: { email: emailNormalized },
    });
    if (existingEmail) {
      const error: any = new Error('Email sudah terdaftar dalam sistem.');
      error.statusCode = 409;
      throw error;
    }

    // Check duplicate NIS
    const existingStudentNumber = await prisma.student.findUnique({
      where: { studentNumber: studentNumberNormalized },
    });
    if (existingStudentNumber) {
      const error: any = new Error('Nomor Induk Siswa (NIS) sudah terdaftar dalam sistem.');
      error.statusCode = 409;
      throw error;
    }

    // Check duplicate NISN
    const existingNisn = await prisma.student.findUnique({
      where: { nisn: nisnNormalized },
    });
    if (existingNisn) {
      const error: any = new Error('NISN sudah terdaftar dalam sistem.');
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await hashPassword(input.password);

    // Atomic Prisma Transaction
    const newStudent = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: input.name.trim(),
          email: emailNormalized,
          password: hashedPassword,
          role: 'STUDENT',
          avatar: input.avatar || null,
          isActive: true,
          student: {
            create: {
              studentNumber: studentNumberNormalized,
              nisn: nisnNormalized,
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
          student: {
            select: {
              id: true,
              studentNumber: true,
              nisn: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return user;
    });

    return newStudent;
  }

  static async updateStudent(id: string, input: UpdateStudentInput) {
    const existing = await prisma.user.findFirst({
      where: { id, role: 'STUDENT' },
      include: { student: true },
    });

    if (!existing || !existing.student) {
      const error: any = new Error('Data siswa tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    // Check email uniqueness if changed
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

    // Check studentNumber (NIS) uniqueness if changed
    if (input.studentNumber && input.studentNumber.trim() !== existing.student.studentNumber) {
      const nisConflict = await prisma.student.findUnique({
        where: { studentNumber: input.studentNumber.trim() },
      });
      if (nisConflict && nisConflict.userId !== id) {
        const error: any = new Error('Nomor Induk Siswa (NIS) sudah digunakan.');
        error.statusCode = 409;
        throw error;
      }
    }

    // Check NISN uniqueness if changed
    if (input.nisn && input.nisn.trim() !== existing.student.nisn) {
      const nisnConflict = await prisma.student.findUnique({
        where: { nisn: input.nisn.trim() },
      });
      if (nisnConflict && nisnConflict.userId !== id) {
        const error: any = new Error('NISN sudah digunakan.');
        error.statusCode = 409;
        throw error;
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      if (input.studentNumber || input.nisn) {
        await tx.student.update({
          where: { userId: id },
          data: {
            ...(input.studentNumber ? { studentNumber: input.studentNumber.trim() } : {}),
            ...(input.nisn ? { nisn: input.nisn.trim() } : {}),
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
          student: {
            select: {
              id: true,
              studentNumber: true,
              nisn: true,
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
      where: { id, role: 'STUDENT' },
    });

    if (!existing) {
      const error: any = new Error('Data siswa tidak ditemukan.');
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
        student: {
          select: {
            id: true,
            studentNumber: true,
            nisn: true,
          },
        },
      },
    });

    return updated;
  }

  static async resetPassword(id: string, newPassword: string) {
    const existing = await prisma.user.findFirst({
      where: { id, role: 'STUDENT' },
    });

    if (!existing) {
      const error: any = new Error('Data siswa tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return {
      message: 'Kata sandi siswa berhasil diperbarui.',
    };
  }

  static async getMyClass(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!student) {
      const error = new Error('Data profil siswa tidak ditemukan.');
      (error as any).statusCode = 404;
      throw error;
    }

    // Find class student enrollment in active academic year or latest
    const enrollment = await (prisma as any).classStudent.findFirst({
      where: {
        studentId: student.id,
      },
      include: {
        class: {
          include: {
            academicYear: true,
            homeroomTeacher: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatar: true },
                },
              },
            },
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
            teachingAssignments: {
              include: {
                teacher: {
                  include: { user: { select: { id: true, name: true, email: true } } },
                },
                subject: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!enrollment) {
      return null;
    }

    const cls = enrollment.class;
    return {
      id: cls.id,
      name: cls.name,
      grade: cls.grade,
      isActive: cls.isActive,
      academicYear: cls.academicYear,
      homeroomTeacher: cls.homeroomTeacher
        ? {
            id: cls.homeroomTeacher.id,
            name: cls.homeroomTeacher.user.name,
            email: cls.homeroomTeacher.user.email,
            avatar: cls.homeroomTeacher.user.avatar,
          }
        : null,
      subjects: cls.teachingAssignments.map((ta: any) => ({
        id: ta.id,
        subjectName: ta.subject.name,
        subjectCode: ta.subject.code,
        teacherName: ta.teacher.user.name,
      })),
      classmates: cls.students.map((cs: any) => ({
        id: cs.student.id,
        name: cs.student.user.name,
        email: cs.student.user.email,
        studentNumber: cs.student.studentNumber,
        nisn: cs.student.nisn,
        avatar: cs.student.user.avatar,
        isMe: cs.student.id === student.id,
      })),
      totalClassmates: cls.students.length,
    };
  }
}
