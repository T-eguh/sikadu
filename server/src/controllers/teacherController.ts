import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TeacherService } from '../services/teacherService';

export const createTeacherSchema = z.object({
  name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  teacherNumber: z.string().min(3, 'Nomor Induk Guru (NIP) wajib diisi minimal 3 karakter'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  avatar: z.string().optional(),
});

export const updateTeacherSchema = z.object({
  name: z.string().min(2, 'Nama lengkap minimal 2 karakter').optional(),
  email: z.string().email('Format email tidak valid').optional(),
  teacherNumber: z.string().min(3, 'Nomor Induk Guru (NIP) minimal 3 karakter').optional(),
  avatar: z.string().optional(),
});

export const updateStatusSchema = z.object({
  isActive: z.boolean({ required_error: 'Status aktif (isActive) wajib ditentukan' }),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Kata sandi baru minimal 6 karakter'),
});

export class TeacherController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search } = req.query;
      const result = await TeacherService.getTeachers({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: typeof search === 'string' ? search : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Daftar guru berhasil diambil',
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
      const teacher = await TeacherService.getTeacherById(id);

      res.status(200).json({
        success: true,
        message: 'Detail guru berhasil diambil',
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const teacher = await TeacherService.createTeacher(req.body);

      res.status(201).json({
        success: true,
        message: 'Guru baru berhasil ditambahkan ke sistem.',
        data: teacher,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await TeacherService.updateTeacher(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Data guru berhasil diperbarui.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const updated = await TeacherService.updateStatus(id, isActive);

      res.status(200).json({
        success: true,
        message: `Akun guru berhasil di${isActive ? 'aktifkan' : 'nonaktifkan'}.`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      const result = await TeacherService.resetPassword(id, newPassword);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyClasses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Otentikasi diperlukan' });
        return;
      }

      const classes = await TeacherService.getMyClasses(userId);

      res.status(200).json({
        success: true,
        message: 'Daftar kelas yang diajar berhasil diambil',
        data: classes,
      });
    } catch (error) {
      next(error);
    }
  }
}
