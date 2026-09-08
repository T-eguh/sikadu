import { prisma } from '../utils/prisma';
import { comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';
import { LoginResponse, UserRole } from '../types';

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      const error: any = new Error('Email atau kata sandi tidak valid.');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error: any = new Error('Akun dinonaktifkan. Silakan hubungi Administrator.');
      error.statusCode = 403;
      throw error;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error: any = new Error('Email atau kata sandi tidak valid.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as UserRole,
        avatar: user.avatar,
      },
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        teacher: {
          select: {
            id: true,
            teacherNumber: true,
          },
        },
        student: {
          select: {
            id: true,
            studentNumber: true,
            nisn: true,
          },
        },
      },
    });

    if (!user) {
      const error: any = new Error('Pengguna tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    return user;
  }
}
