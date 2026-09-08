import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ModuleContentService } from '../services/moduleContentService';

export const createContentSchema = z.object({
  title: z.string().min(2, 'Judul materi minimal 2 karakter'),
  description: z.string().optional(),
  contentType: z.enum(['TEXT', 'DOCUMENT', 'VIDEO', 'IMAGE']),
  textContent: z.string().optional(),
  fileUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  orderNumber: z.number().int().positive().optional(),
});

export const updateContentSchema = z.object({
  title: z.string().min(2, 'Judul materi minimal 2 karakter').optional(),
  description: z.string().optional(),
  contentType: z.enum(['TEXT', 'DOCUMENT', 'VIDEO', 'IMAGE']).optional(),
  textContent: z.string().optional(),
  fileUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  imageUrl: z.string().optional(),
  orderNumber: z.number().int().positive().optional(),
});

export const reorderSchema = z.object({
  contentIds: z.array(z.string().min(1)).min(1, 'Minimal satu ID materi harus diberikan'),
});

export class ModuleContentController {
  /**
   * Mengambil semua materi dalam satu modul
   */
  static async getContents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: moduleId } = req.params;
      const user = (req as any).user;

      const contents = await ModuleContentService.getContentsByModuleId(moduleId, user);

      res.status(200).json({
        success: true,
        message: 'Daftar materi modul berhasil diambil.',
        data: contents,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menambahkan materi ke modul
   */
  static async createContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: moduleId } = req.params;
      const user = (req as any).user;
      const validatedData = createContentSchema.parse(req.body);

      const created = await ModuleContentService.createContent(moduleId, user, validatedData as any);

      res.status(201).json({
        success: true,
        message: 'Materi berhasil ditambahkan ke dalam modul.',
        data: created,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mengubah materi modul
   */
  static async updateContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: contentId } = req.params;
      const user = (req as any).user;
      const validatedData = updateContentSchema.parse(req.body);

      const updated = await ModuleContentService.updateContent(contentId, user, validatedData as any);

      res.status(200).json({
        success: true,
        message: 'Materi modul berhasil diperbarui.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Menghapus materi modul
   */
  static async deleteContent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: contentId } = req.params;
      const user = (req as any).user;

      const result = await ModuleContentService.deleteContent(contentId, user);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mengatur ulang urutan materi
   */
  static async reorderContents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id: moduleId } = req.params;
      const user = (req as any).user;
      const { contentIds } = reorderSchema.parse(req.body);

      const reordered = await ModuleContentService.reorderContents(moduleId, user, contentIds);

      res.status(200).json({
        success: true,
        message: 'Urutan materi berhasil diperbarui.',
        data: reordered,
      });
    } catch (error) {
      next(error);
    }
  }
}
