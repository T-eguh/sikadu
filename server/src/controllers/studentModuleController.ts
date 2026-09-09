import { Request, Response, NextFunction } from 'express';
import { StudentModuleService } from '../services/studentModuleService';

export class StudentModuleController {
  /**
   * Siswa: Melihat modul yang tersedia untuk kelasnya
   */
  static async getModules(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { search, subjectId } = req.query;

      const result = await StudentModuleService.getStudentModules(userId, {
        search: typeof search === 'string' ? search : undefined,
        subjectId: typeof subjectId === 'string' ? subjectId : undefined,
      });

      res.status(200).json({
        success: true,
        message: 'Daftar modul pembelajaran kelas berhasil diambil.',
        data: result.modules,
        activeYear: result.activeYear,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Siswa: Melihat detail modul dan daftar materi
   */
  static async getModuleDetail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      const moduleDetail = await StudentModuleService.getStudentModuleDetail(userId, id);

      res.status(200).json({
        success: true,
        message: 'Detail modul pembelajaran berhasil diambil.',
        data: moduleDetail,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Siswa: Mendapatkan persentase dan progres modul
   */
  static async getModuleProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      const stats = await StudentModuleService.getModuleProgress(userId, id);

      res.status(200).json({
        success: true,
        message: 'Progres modul berhasil dihitung.',
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Siswa: Menandai materi selesai
   */
  static async completeContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { contentId } = req.params;

      const result = await StudentModuleService.completeContent(userId, contentId);

      res.status(200).json({
        success: true,
        message: 'Materi berhasil ditandai selesai.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Siswa: Menandai materi belum selesai
   */
  static async uncompleteContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const { contentId } = req.params;

      const result = await StudentModuleService.uncompleteContent(userId, contentId);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.stats,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Siswa: Mengambil profil lengkap siswa BISA
   */
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const profile = await StudentModuleService.getProfile(userId);

      res.status(200).json({
        success: true,
        message: 'Profil siswa berhasil diambil.',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}
