import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { TeachingAssignmentService } from '../services/teachingAssignmentService';

export const createTeachingAssignmentSchema = z.object({
  teacherId: z.string().min(1, 'Guru wajib dipilih'),
  classId: z.string().min(1, 'Kelas wajib dipilih'),
  subjectId: z.string().min(1, 'Mata pelajaran wajib dipilih'),
  academicYearId: z.string().min(1, 'Tahun ajaran wajib dipilih'),
});

export const updateTeachingAssignmentSchema = z.object({
  teacherId: z.string().optional(),
  classId: z.string().optional(),
  subjectId: z.string().optional(),
  academicYearId: z.string().optional(),
});

export class TeachingAssignmentController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { teacherId, classId, subjectId, academicYearId, page, limit } = req.query;
      const result = await TeachingAssignmentService.getTeachingAssignments({
        teacherId: typeof teacherId === 'string' ? teacherId : undefined,
        classId: typeof classId === 'string' ? classId : undefined,
        subjectId: typeof subjectId === 'string' ? subjectId : undefined,
        academicYearId: typeof academicYearId === 'string' ? academicYearId : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Daftar penugasan mengajar berhasil diambil',
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
      const assignment = await TeachingAssignmentService.getTeachingAssignmentById(id);

      res.status(200).json({
        success: true,
        message: 'Detail penugasan mengajar berhasil diambil',
        data: assignment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = createTeachingAssignmentSchema.parse(req.body);
      const newAssignment = await TeachingAssignmentService.createTeachingAssignment(validatedData);

      res.status(201).json({
        success: true,
        message: 'Penugasan mengajar baru berhasil dibuat',
        data: newAssignment,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = updateTeachingAssignmentSchema.parse(req.body);
      const updated = await TeachingAssignmentService.updateTeachingAssignment(id, validatedData);

      res.status(200).json({
        success: true,
        message: 'Penugasan mengajar berhasil diperbarui',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const result = await TeachingAssignmentService.deleteTeachingAssignment(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
