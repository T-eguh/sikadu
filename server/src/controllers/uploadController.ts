import { Request, Response, NextFunction } from 'express';

export class UploadController {
  static async uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Berkas dokumen wajib diunggah.',
          errors: [{ field: 'file', message: 'Berkas tidak ditemukan dalam request' }],
        });
        return;
      }

      const fileUrl = `/uploads/modules/documents/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'Dokumen berhasil diunggah.',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          fileUrl,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'Berkas gambar wajib diunggah.',
          errors: [{ field: 'file', message: 'Berkas tidak ditemukan dalam request' }],
        });
        return;
      }

      const imageUrl = `/uploads/modules/images/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'Gambar berhasil diunggah.',
        data: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          imageUrl,
          fileSize: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
