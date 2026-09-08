import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AcademicYearService } from '../services/academicYearService';

export const createAcademicYearSchema = z.object({
  name: z.string().min(1, 'Nama tahun ajaran wajib diisi (contoh: 2026/2027)'),
  startDate: z.string().min(1, 'Tanggal mulai wajib diisi'),
  endDate: z.string().min(1, 'Tanggal selesai wajib diisi'),
  isActive: z.boolean().optional(),
});

export const updateAcademicYearSchema = z.object({
  name: z.string().min(1, 'Nama tahun ajaran wajib diisi').optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateStatusSchema = z.object({
  isActive: z.boolean({ required_error: 'Status aktif (isActive) wajib ditentukan' }),
});

export class AcademicYearController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, isActive } = req.query;
      const result = await AcademicYearService.getAcademicYears({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: typeof search === 'string' ? search : undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Daftar tahun ajaran berhasil diambil',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getActive(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const activeYear = await AcademicYearService.getActiveAcademicYear();

      res.status(200).json({
        success: true,
        message: 'Tahun ajaran aktif berhasil diambil',
        data: activeYear,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const academicYear = await AcademicYearService.getAcademicYearById(id);

      res.status(200).json({
        success: true,
        message: 'Detail tahun ajaran berhasil diambil',
        data: academicYear,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createAcademicYearSchema.parse(req.body);
      const newAcademicYear = await AcademicYearService.createAcademicYear(validatedData);

      res.status(201).json({
        success: true,
        message: 'Tahun ajaran baru berhasil ditambahkan',
        data: newAcademicYear,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateAcademicYearSchema.parse(req.body);
      const updated = await AcademicYearService.updateAcademicYear(id, validatedData);

      res.status(200).json({
        success: true,
        message: 'Data tahun ajaran berhasil diperbarui',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = updateStatusSchema.parse(req.body);
      const updated = await AcademicYearService.updateStatus(id, isActive);

      res.status(200).json({
        success: true,
        message: `Tahun ajaran berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
