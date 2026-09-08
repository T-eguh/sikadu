import { prisma } from '../utils/prisma';

export interface GetSubjectsQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateSubjectInput {
  name: string;
  code: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateSubjectInput {
  name?: string;
  code?: string;
  description?: string;
  isActive?: boolean;
}

export class SubjectService {
  static async getSubjects(query: GetSubjectsQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 20));
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const [total, subjects] = await Promise.all([
      (prisma as any).subject.count({ where }),
      (prisma as any).subject.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              teachingAssignments: true,
            },
          },
        },
      }),
    ]);

    return {
      data: subjects,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getSubjectById(id: string) {
    const subject = await (prisma as any).subject.findUnique({
      where: { id },
      include: {
        teachingAssignments: {
          include: {
            teacher: {
              include: { user: { select: { id: true, name: true, email: true } } },
            },
            class: { select: { id: true, name: true, grade: true } },
            academicYear: { select: { id: true, name: true, isActive: true } },
          },
        },
        _count: {
          select: {
            teachingAssignments: true,
          },
        },
      },
    });

    if (!subject) {
      const error = new Error('Mata pelajaran tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    return subject;
  }

  static async createSubject(input: CreateSubjectInput) {
    const code = input.code.trim().toUpperCase();

    // Check code uniqueness
    const existing = await (prisma as any).subject.findUnique({
      where: { code },
    });

    if (existing) {
      const error = new Error(`Kode mata pelajaran "${code}" sudah digunakan`);
      (error as any).statusCode = 409;
      throw error;
    }

    return (prisma as any).subject.create({
      data: {
        name: input.name.trim(),
        code,
        description: input.description?.trim() || null,
        isActive: input.isActive ?? true,
      },
    });
  }

  static async updateSubject(id: string, input: UpdateSubjectInput) {
    const existing = await (prisma as any).subject.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Mata pelajaran tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    if (input.code) {
      const code = input.code.trim().toUpperCase();
      if (code !== existing.code) {
        const codeConflict = await (prisma as any).subject.findUnique({ where: { code } });
        if (codeConflict) {
          const error = new Error(`Kode mata pelajaran "${code}" sudah digunakan`);
          (error as any).statusCode = 409;
          throw error;
        }
      }
    }

    return (prisma as any).subject.update({
      where: { id },
      data: {
        name: input.name ? input.name.trim() : undefined,
        code: input.code ? input.code.trim().toUpperCase() : undefined,
        description: input.description !== undefined ? input.description?.trim() || null : undefined,
        isActive: input.isActive !== undefined ? input.isActive : undefined,
      },
    });
  }

  static async updateStatus(id: string, isActive: boolean) {
    const existing = await (prisma as any).subject.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Mata pelajaran tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    return (prisma as any).subject.update({
      where: { id },
      data: { isActive },
    });
  }
}
