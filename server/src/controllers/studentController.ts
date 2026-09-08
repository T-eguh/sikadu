import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { StudentService } from '../services/studentService';

export const createStudentSchema = z.object({
  name: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  studentNumber: z.string().min(2, 'Nomor Induk Siswa (NIS) wajib diisi'),
  nisn: z.string().min(5, 'NISN minimal 5 karakter'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
  avatar: z.string().optional(),
});

export const updateStudentSchema = z.object({
  name: z.string().min(2, 'Nama lengkap minimal 2 karakter').optional(),
  email: z.string().email('Format email tidak valid').optional(),
  studentNumber: z.string().min(2, 'Nomor Induk Siswa (NIS) minimal 2 karakter').optional(),
  nisn: z.string().min(5, 'NISN minimal 5 karakter').optional(),
  avatar: z.string().optional(),
});

export const updateStatusSchema = z.object({
  isActive: z.boolean({ required_error: 'Status aktif (isActive) wajib ditentukan' }),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Kata sandi baru minimal 6 karakter'),
});

export class StudentController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search } = req.query;
      const result = await StudentService.getStudents({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: typeof search === 'string' ? search : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Daftar siswa berhasil diambil',
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
      const student = await StudentService.getStudentById(id);

      res.status(200).json({
        success: true,
        message: 'Detail siswa berhasil diambil',
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const student = await StudentService.createStudent(req.body);

      res.status(201).json({
        success: true,
        message: 'Siswa baru berhasil ditambahkan ke sistem.',
        data: student,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await StudentService.updateStudent(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Data siswa berhasil diperbarui.',
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
      const updated = await StudentService.updateStatus(id, isActive);

      res.status(200).json({
        success: true,
        message: `Akun siswa berhasil di${isActive ? 'aktifkan' : 'nonaktifkan'}.`,
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
      const result = await StudentService.resetPassword(id, newPassword);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMyClass(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Otentikasi diperlukan' });
        return;
      }

      const myClass = await StudentService.getMyClass(userId);

      res.status(200).json({
        success: true,
        message: myClass ? 'Data kelas siswa berhasil diambil' : 'Siswa belum terdaftar pada kelas aktif',
        data: myClass,
      });
    } catch (error) {
      next(error);
    }
  }
}
