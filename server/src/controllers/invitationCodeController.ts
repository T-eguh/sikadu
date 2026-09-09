import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { InvitationCodeService } from '../services/invitationCodeService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const createInvitationCodeSchema = z.object({
  maxUses: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().datetime().nullable().optional(),
});

export const joinClassSchema = z.object({
  code: z.string().min(3, 'Kode kelas minimal 3 karakter').optional(),
  invitationCode: z.string().min(3, 'Kode kelas minimal 3 karakter').optional(),
}).refine((data: any) => !!(data.code || data.invitationCode), {
  message: 'Kode kelas wajib dimasukkan',
});

export class InvitationCodeController {
  /**
   * Admin: Generate kode kelas baru untuk kelas tertentu
   */
  static async createCode(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { classId } = req.params;
      const adminUserId = req.user!.id;
      const { maxUses, expiresAt } = req.body;

      const code = await InvitationCodeService.createInvitationCode(classId, adminUserId, {
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      });

      res.status(201).json({
        success: true,
        message: 'Kode kelas berhasil dibuat',
        data: code,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Mengambil daftar kode kelas untuk kelas tertentu
   */
  static async getCodes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { classId } = req.params;
      const codes = await InvitationCodeService.getCodesByClass(classId);

      res.status(200).json({
        success: true,
        data: codes,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Menonaktifkan kode kelas
   */
  static async deactivateCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { codeId } = req.params;
      const result = await InvitationCodeService.deactivateCode(codeId);

      res.status(200).json({
        success: true,
        message: 'Kode kelas berhasil dinonaktifkan',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin: Regenerate kode kelas baru
   */
  static async regenerateCode(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { classId, codeId } = req.params;
      const adminUserId = req.user!.id;

      const newCode = await InvitationCodeService.regenerateCode(classId, codeId, adminUserId);

      res.status(201).json({
        success: true,
        message: 'Kode kelas baru berhasil dibuat',
        data: newCode,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Siswa: Bergabung ke kelas menggunakan Kode Kelas
   */
  static async joinClass(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const rawCode = req.body.code || req.body.invitationCode;

      const result = await InvitationCodeService.joinClassByCode(userId, rawCode);

      res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
