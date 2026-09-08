import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server';
  let errors = err.errors || [];

  if (err instanceof MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      statusCode = 413;
      message = 'Ukuran berkas melebihi batas maksimal yang diizinkan.';
    } else {
      statusCode = 400;
      message = `Kesalahan unggah berkas: ${err.message}`;
    }
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = err.errors[0]?.message || 'Validasi data gagal';
    errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${statusCode} - ${message}:`, err.stack || err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

