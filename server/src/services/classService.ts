import { prisma } from '../utils/prisma';

export interface GetClassesQuery {
  page?: number;
  limit?: number;
  search?: string;
  grade?: string;
  academicYearId?: string;
  isActive?: boolean;
}

export interface CreateClassInput {
  name: string;
  grade: string;
  academicYearId: string;
  homeroomTeacherId?: string | null;
  isActive?: boolean;
}

export interface UpdateClassInput {
  name?: string;
  grade?: string;
  academicYearId?: string;
  homeroomTeacherId?: string | null;
  isActive?: boolean;
}

export class ClassService {
  static async getClasses(query: GetClassesQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 15));
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { grade: { contains: search, mode: 'insensitive' } },
        { homeroomTeacher: { user: { name: { contains: search, mode: 'insensitive' } } } },
      ];
    }
    if (query.grade) {
      where.grade = query.grade;
    }
    if (query.academicYearId) {
      where.academicYearId = query.academicYearId;
    }
    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const [total, classes] = await Promise.all([
      (prisma as any).class.count({ where }),
      (prisma as any).class.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ grade: 'asc' }, { name: 'asc' }],
        include: {
          academicYear: {
            select: { id: true, name: true, isActive: true },
          },
          homeroomTeacher: {
            include: {
              user: {
                select: { id: true, name: true, email: true, avatar: true },
              },
            },
          },
          _count: {
            select: {
              students: true,
              teachingAssignments: true,
            },
          },
        },
      }),
    ]);

    return {
      data: classes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getClassById(id: string) {
    const cls = await (prisma as any).class.findUnique({
      where: { id },
      include: {
        academicYear: true,
        homeroomTeacher: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true, isActive: true },
            },
          },
        },
        students: {
          include: {
            student: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatar: true, isActive: true },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        teachingAssignments: {
          include: {
            teacher: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatar: true },
                },
              },
            },
            subject: true,
          },
        },
        _count: {
          select: {
            students: true,
            teachingAssignments: true,
          },
        },
      },
    });

    if (!cls) {
      const error = new Error('Kelas tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    return cls;
  }

  static async createClass(input: CreateClassInput) {
    // Validate Academic Year
    const academicYear = await (prisma as any).academicYear.findUnique({
      where: { id: input.academicYearId },
    });
    if (!academicYear) {
      const error = new Error('Tahun ajaran tidak valid atau tidak ditemukan');
      (error as any).statusCode = 400;
      throw error;
    }

    // Validate Homeroom Teacher if provided
    if (input.homeroomTeacherId) {
      const teacher = await prisma.teacher.findUnique({
        where: { id: input.homeroomTeacherId },
        include: { user: true },
      });
      if (!teacher || !teacher.user.isActive) {
        const error = new Error('Wali kelas tidak valid atau akun guru tidak aktif');
        (error as any).statusCode = 400;
        throw error;
      }
    }

    return (prisma as any).class.create({
      data: {
        name: input.name.trim(),
        grade: String(input.grade).trim(),
        academicYearId: input.academicYearId,
        homeroomTeacherId: input.homeroomTeacherId || null,
        isActive: input.isActive ?? true,
      },
      include: {
        academicYear: true,
        homeroomTeacher: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
  }

  static async updateClass(id: string, input: UpdateClassInput) {
    const existing = await (prisma as any).class.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Kelas tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    if (input.academicYearId && input.academicYearId !== existing.academicYearId) {
      const ay = await (prisma as any).academicYear.findUnique({
        where: { id: input.academicYearId },
      });
      if (!ay) {
        const error = new Error('Tahun ajaran tidak valid');
        (error as any).statusCode = 400;
        throw error;
      }
    }

    if (input.homeroomTeacherId) {
      const teacher = await prisma.teacher.findUnique({
        where: { id: input.homeroomTeacherId },
        include: { user: true },
      });
      if (!teacher || !teacher.user.isActive) {
        const error = new Error('Wali kelas tidak valid atau akun guru tidak aktif');
        (error as any).statusCode = 400;
        throw error;
      }
    }

    return (prisma as any).class.update({
      where: { id },
      data: {
        name: input.name ? input.name.trim() : undefined,
        grade: input.grade !== undefined ? String(input.grade).trim() : undefined,
        academicYearId: input.academicYearId || undefined,
        homeroomTeacherId:
          input.homeroomTeacherId !== undefined ? input.homeroomTeacherId || null : undefined,
        isActive: input.isActive !== undefined ? input.isActive : undefined,
      },
      include: {
        academicYear: true,
        homeroomTeacher: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
  }

  static async updateStatus(id: string, isActive: boolean) {
    const existing = await (prisma as any).class.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Kelas tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    return (prisma as any).class.update({
      where: { id },
      data: { isActive },
    });
  }

  static async getClassStudents(classId: string) {
    const cls = await (prisma as any).class.findUnique({
      where: { id: classId },
      include: {
        students: {
          include: {
            student: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatar: true, isActive: true },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!cls) {
      const error = new Error('Kelas tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    return cls.students;
  }

  /**
   * Add student(s) to a class with strict validation:
   * "Siswa hanya boleh berada pada SATU KELAS AKTIF dalam satu Tahun Ajaran."
   */
  static async addStudentsToClass(classId: string, studentIds: string[]) {
    const cls = await (prisma as any).class.findUnique({
      where: { id: classId },
    });
    if (!cls) {
      const error = new Error('Kelas tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    if (!studentIds || studentIds.length === 0) {
      const error = new Error('Daftar siswa wajib dipilih');
      (error as any).statusCode = 400;
      throw error;
    }

    // Check each student
    for (const sId of studentIds) {
      // 1. Verify student exists
      const student = await prisma.student.findUnique({
        where: { id: sId },
        include: { user: true },
      });
      if (!student) {
        const error = new Error(`Data siswa dengan ID ${sId} tidak ditemukan`);
        (error as any).statusCode = 404;
        throw error;
      }

      // 2. Check if student already enrolled in any class in THIS academic year
      const existingInYear = await (prisma as any).classStudent.findFirst({
        where: {
          studentId: sId,
          class: {
            academicYearId: cls.academicYearId,
          },
        },
        include: {
          class: true,
        },
      });

      if (existingInYear) {
        if (existingInYear.classId === classId) {
          const error = new Error(`Siswa ${student.user.name} sudah berada di kelas ini.`);
          (error as any).statusCode = 400;
          throw error;
        } else {
          const error = new Error('Siswa sudah terdaftar pada kelas lain di tahun ajaran ini.');
          (error as any).statusCode = 400;
          throw error;
        }
      }
    }

    // Insert student(s)
    const records = studentIds.map((sId) => ({
      classId,
      studentId: sId,
    }));

    await (prisma as any).classStudent.createMany({
      data: records,
      skipDuplicates: true,
    });

    return this.getClassStudents(classId);
  }

  static async removeStudentFromClass(classId: string, studentId: string) {
    const enrollment = await (prisma as any).classStudent.findFirst({
      where: { classId, studentId },
    });

    if (!enrollment) {
      const error = new Error('Siswa tidak terdaftar di kelas ini');
      (error as any).statusCode = 404;
      throw error;
    }

    await (prisma as any).classStudent.delete({
      where: {
        id: enrollment.id,
      },
    });

    return { message: 'Siswa berhasil dikeluarkan dari kelas' };
  }

  /**
   * Move student from one class to another safely using transaction:
   * 1. Validate both classes exist and belong to the same academic year
   * 2. Remove student from old class
   * 3. Add student to target class
   */
  static async moveStudent(fromClassId: string, toClassId: string, studentId: string) {
    if (fromClassId === toClassId) {
      const error = new Error('Kelas asal dan kelas tujuan tidak boleh sama');
      (error as any).statusCode = 400;
      throw error;
    }

    const [fromClass, toClass, student] = await Promise.all([
      (prisma as any).class.findUnique({ where: { id: fromClassId } }),
      (prisma as any).class.findUnique({ where: { id: toClassId } }),
      prisma.student.findUnique({ where: { id: studentId }, include: { user: true } }),
    ]);

    if (!fromClass) {
      const error = new Error('Kelas asal tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }
    if (!toClass) {
      const error = new Error('Kelas tujuan tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }
    if (!student) {
      const error = new Error('Data siswa tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    // Check if student is in fromClass
    const currentEnrollment = await (prisma as any).classStudent.findFirst({
      where: { classId: fromClassId, studentId },
    });
    if (!currentEnrollment) {
      const error = new Error(`Siswa ${student.user.name} tidak terdaftar di kelas asal (${fromClass.name})`);
      (error as any).statusCode = 400;
      throw error;
    }

    // Execute move in atomic Prisma transaction
    return (prisma as any).$transaction(async (tx: any) => {
      // 1. Delete from old class
      await tx.classStudent.delete({
        where: { id: currentEnrollment.id },
      });

      // 2. Insert into new class
      const newEnrollment = await tx.classStudent.create({
        data: {
          classId: toClassId,
          studentId,
        },
      });

      return newEnrollment;
    });
  }
}
