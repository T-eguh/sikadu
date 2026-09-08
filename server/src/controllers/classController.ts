import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ClassService } from '../services/classService';

export const createClassSchema = z.object({
  name: z.string().min(1, 'Nama kelas wajib diisi (contoh: 7A)'),
  grade: z.string().min(1, 'Tingkat kelas wajib diisi (contoh: 7)'),
  academicYearId: z.string().min(1, 'Tahun ajaran wajib dipilih'),
  homeroomTeacherId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const updateClassSchema = z.object({
  name: z.string().min(1, 'Nama kelas wajib diisi').optional(),
  grade: z.string().min(1, 'Tingkat kelas wajib diisi').optional(),
  academicYearId: z.string().optional(),
  homeroomTeacherId: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

export const updateClassStatusSchema = z.object({
  isActive: z.boolean({ required_error: 'Status aktif (isActive) wajib ditentukan' }),
});

export const addStudentsSchema = z.object({
  studentIds: z.array(z.string()).min(1, 'Pilih minimal satu siswa untuk dimasukkan ke kelas'),
});

export const moveStudentSchema = z.object({
  studentId: z.string().min(1, 'ID siswa wajib disertakan'),
  targetClassId: z.string().min(1, 'Kelas tujuan wajib dipilih'),
});

export class ClassController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, grade, academicYearId, isActive } = req.query;
      const result = await ClassService.getClasses({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: typeof search === 'string' ? search : undefined,
        grade: typeof grade === 'string' ? grade : undefined,
        academicYearId: typeof academicYearId === 'string' ? academicYearId : undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Daftar kelas berhasil diambil',
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
      const cls = await ClassService.getClassById(id);

      res.status(200).json({
        success: true,
        message: 'Detail kelas berhasil diambil',
        data: cls,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createClassSchema.parse(req.body);
      const newClass = await ClassService.createClass(validatedData);

      res.status(201).json({
        success: true,
        message: 'Kelas baru berhasil dibuat',
        data: newClass,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateClassSchema.parse(req.body);
      const updated = await ClassService.updateClass(id, validatedData);

      res.status(200).json({
        success: true,
        message: 'Data kelas berhasil diperbarui',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = updateClassStatusSchema.parse(req.body);
      const updated = await ClassService.updateStatus(id, isActive);

      res.status(200).json({
        success: true,
        message: `Kelas berhasil ${isActive ? 'diaktifkan' : 'dinonaktifkan'}`,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const students = await ClassService.getClassStudents(id);

      res.status(200).json({
        success: true,
        message: 'Daftar siswa dalam kelas berhasil diambil',
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }

  static async addStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { studentIds } = addStudentsSchema.parse(req.body);
      const students = await ClassService.addStudentsToClass(id, studentIds);

      res.status(200).json({
        success: true,
        message: 'Siswa berhasil dimasukkan ke dalam kelas',
        data: students,
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, studentId } = req.params;
      const result = await ClassService.removeStudentFromClass(id, studentId);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async moveStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params; // fromClassId
      const { studentId, targetClassId } = moveStudentSchema.parse(req.body);
      const result = await ClassService.moveStudent(id, targetClassId, studentId);

      res.status(200).json({
        success: true,
        message: 'Siswa berhasil dipindahkan ke kelas tujuan',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
