import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../utils/prisma';
import { UserRole, JwtPayload } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    name: string;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Akses ditolak. Token otentikasi tidak ditemukan.',
        errors: [],
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    let payload: JwtPayload;

    try {
      payload = verifyToken(token);
    } catch (err) {
      res.status(401).json({
        success: false,
        message: 'Token tidak valid atau telah kedaluwarsa.',
        errors: [],
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        isActive: true,
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan dalam sistem.',
        errors: [],
      });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan. Silakan hubungi Administrator.',
        errors: [],
      });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role as UserRole,
      name: user.name,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Otentikasi diperlukan.',
        errors: [],
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Akses ditolak. Anda tidak memiliki izin (${roles.join(', ')}) untuk mengakses resource ini.`,
        errors: [],
      });
      return;
    }

    next();
  };
};
