import { prisma } from '../utils/prisma';

export interface GetAcademicYearsQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateAcademicYearInput {
  name: string;
  startDate: string | Date;
  endDate: string | Date;
  isActive?: boolean;
}

export interface UpdateAcademicYearInput {
  name?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  isActive?: boolean;
}

export class AcademicYearService {
  static async getAcademicYears(query: GetAcademicYearsQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(query.limit) || 10));
    const skip = (page - 1) * limit;
    const search = query.search?.trim();

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (typeof query.isActive === 'boolean') {
      where.isActive = query.isActive;
    }

    const [total, academicYears] = await Promise.all([
      (prisma as any).academicYear.count({ where }),
      (prisma as any).academicYear.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startDate: 'desc' },
        include: {
          _count: {
            select: {
              classes: true,
              teachingAssignments: true,
            },
          },
        },
      }),
    ]);

    return {
      data: academicYears,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getActiveAcademicYear() {
    const activeYear = await (prisma as any).academicYear.findFirst({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            classes: true,
            teachingAssignments: true,
          },
        },
      },
    });

    return activeYear;
  }

  static async getAcademicYearById(id: string) {
    const academicYear = await (prisma as any).academicYear.findUnique({
      where: { id },
      include: {
        classes: {
          select: {
            id: true,
            name: true,
            grade: true,
            isActive: true,
            _count: {
              select: { students: true },
            },
          },
        },
        _count: {
          select: {
            classes: true,
            teachingAssignments: true,
          },
        },
      },
    });

    if (!academicYear) {
      const error = new Error('Tahun ajaran tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    return academicYear;
  }

  static async createAcademicYear(input: CreateAcademicYearInput) {
    const startDate = new Date(input.startDate);
    const endDate = new Date(input.endDate);

    if (startDate >= endDate) {
      const error = new Error('Tanggal mulai harus sebelum tanggal selesai');
      (error as any).statusCode = 400;
      throw error;
    }

    // If isActive is true, enforce only ONE active academic year using transaction
    if (input.isActive) {
      return (prisma as any).$transaction(async (tx: any) => {
        await tx.academicYear.updateMany({
          data: { isActive: false },
        });

        return tx.academicYear.create({
          data: {
            name: input.name.trim(),
            startDate,
            endDate,
            isActive: true,
          },
        });
      });
    }

    return (prisma as any).academicYear.create({
      data: {
        name: input.name.trim(),
        startDate,
        endDate,
        isActive: false,
      },
    });
  }

  static async updateAcademicYear(id: string, input: UpdateAcademicYearInput) {
    const existing = await (prisma as any).academicYear.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Tahun ajaran tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    const startDate = input.startDate ? new Date(input.startDate) : existing.startDate;
    const endDate = input.endDate ? new Date(input.endDate) : existing.endDate;

    if (startDate >= endDate) {
      const error = new Error('Tanggal mulai harus sebelum tanggal selesai');
      (error as any).statusCode = 400;
      throw error;
    }

    // If changing isActive to true, deactivate all others via transaction
    if (input.isActive === true) {
      return (prisma as any).$transaction(async (tx: any) => {
        await tx.academicYear.updateMany({
          where: { id: { not: id } },
          data: { isActive: false },
        });

        return tx.academicYear.update({
          where: { id },
          data: {
            name: input.name ? input.name.trim() : undefined,
            startDate,
            endDate,
            isActive: true,
          },
        });
      });
    }

    return (prisma as any).academicYear.update({
      where: { id },
      data: {
        name: input.name ? input.name.trim() : undefined,
        startDate,
        endDate,
        isActive: input.isActive !== undefined ? input.isActive : undefined,
      },
    });
  }

  static async updateStatus(id: string, isActive: boolean) {
    const existing = await (prisma as any).academicYear.findUnique({ where: { id } });
    if (!existing) {
      const error = new Error('Tahun ajaran tidak ditemukan');
      (error as any).statusCode = 404;
      throw error;
    }

    if (isActive) {
      // Set all others to inactive and activate this one
      return (prisma as any).$transaction(async (tx: any) => {
        await tx.academicYear.updateMany({
          where: { id: { not: id } },
          data: { isActive: false },
        });

        return tx.academicYear.update({
          where: { id },
          data: { isActive: true },
        });
      });
    } else {
      return (prisma as any).academicYear.update({
        where: { id },
        data: { isActive: false },
      });
    }
  }
}
