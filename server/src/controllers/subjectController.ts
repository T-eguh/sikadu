import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { SubjectService } from '../services/subjectService';

export const createSubjectSchema = z.object({
  name: z.string().min(1, 'Nama mata pelajaran wajib diisi'),
  code: z.string().min(1, 'Kode mata pelajaran wajib diisi'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(1, 'Nama mata pelajaran wajib diisi').optional(),
  code: z.string().min(1, 'Kode mata pelajaran wajib diisi').optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const updateSubjectStatusSchema = z.object({
  isActive: z.boolean({ required_error: 'Status aktif (isActive) wajib ditentukan' }),
});

export class SubjectController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, isActive } = req.query;
      const result = await SubjectService.getSubjects({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: typeof search === 'string' ? search : undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Daftar mata pelajaran berhasil diambil',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const subject = await SubjectService.getSubjectById(id);

      res.status(200).json({
        success: true,
        message: 'Detail mata pelajaran berhasil diambil',
        data: subject,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createSubjectSchema.parse(req.body);
      const newSubject = await SubjectService.createSubject(validatedData);

      res.status(201).json({
        success: true,
        message: 'Mata pelajaran baru berhasil ditambahkan',
        data: newSubject,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateSubjectSchema.parse(req.body);
      const updated = await SubjectService.updateSubject(id, validatedData);

      res.status(200).json({
        success: true,
        message: 'Data mata pelajaran berhasil diperbarui',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = updateSubjectStatusSchema.parse(req.body);
      const updated = await SubjectService.updateStatus(id, isActive);

      res.status(200).json({
        success: true,
        message: `Mata pelajaran berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}
