import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ModuleService } from '../services/moduleService';
import { ModuleStatus } from '../types';

export const createModuleSchema = z.object({
  title: z.string().min(3, 'Judul modul minimal 3 karakter'),
  description: z.string().optional(),
  learningObjectives: z.string().min(5, 'Tujuan pembelajaran wajib diisi minimal 5 karakter'),
  teachingAssignmentId: z.string().min(1, 'Penugasan mengajar (Teaching Assignment) wajib dipilih'),
  thumbnailUrl: z.string().optional(),
});

export const updateModuleSchema = z.object({
  title: z.string().min(3, 'Judul modul minimal 3 karakter').optional(),
  description: z.string().optional(),
  learningObjectives: z.string().min(5, 'Tujuan pembelajaran minimal 5 karakter').optional(),
  thumbnailUrl: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED']),
  reviewNote: z.string().optional(),
});

export class ModuleController {
  /**
   * Admin: Melihat semua modul
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, status, teacherId, classId, subjectId, academicYearId } = req.query;

      const result = await ModuleService.getAllModules({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: typeof search === 'string' ? search : undefined,
        status: typeof status === 'string' ? (status as ModuleStatus) : undefined,
        teacherId: typeof teacherId === 'string' ? teacherId : undefined,
        classId: typeof classId === 'string' ? classId : undefined,
        subjectId: typeof subjectId === 'string' ? subjectId : undefined,
        academicYearId: typeof academicYearId === 'string' ? academicYearId : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Daftar semua modul berhasil diambil.',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Guru: Melihat modul milik sendiri
   */
  static async getMy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { page, limit, search, status } = req.query;

      const result = await ModuleService.getMyModules(userId, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: typeof search === 'string' ? search : undefined,
        status: typeof status === 'string' ? (status as ModuleStatus) : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Daftar modul saya berhasil diambil.',
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Melihat detail modul (Admin, Guru, Siswa)
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const moduleData = await ModuleService.getModuleById(id, user);

      res.status(200).json({
        success: true,
        message: 'Detail modul pembelajaran berhasil diambil.',
        data: moduleData,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Guru: Membuat modul baru
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const validatedData = createModuleSchema.parse(req.body);

      const created = await ModuleService.createModule(userId, validatedData);

      res.status(201).json({
        success: true,
        message: 'Modul pembelajaran berhasil dibuat dengan status DRAFT.',
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Guru: Mengedit modul
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      const validatedData = updateModuleSchema.parse(req.body);

      const result = await ModuleService.updateModule(id, userId, validatedData);

      res.status(200).json({
        success: true,
        message: result.revertedToDraft
          ? 'Modul berhasil diperbarui dan status dikembalikan ke DRAFT untuk ditinjau ulang.'
          : 'Modul berhasil diperbarui.',
        data: result.module,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin / Guru: Mengubah status modul
   */
  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      const validatedData = updateStatusSchema.parse(req.body);

      const result = await ModuleService.updateModuleStatus(
        id,
        user,
        validatedData.status,
        validatedData.reviewNote
      );

      res.status(200).json({
        success: true,
        message: `Status modul berhasil diubah menjadi ${validatedData.status}.`,
        data: result.module,
        reviewNote: result.reviewNote,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Hapus modul
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      const result = await ModuleService.deleteModule(id, user);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
