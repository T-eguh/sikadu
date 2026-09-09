import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/authService';
import { GoogleAuthService } from '../services/googleAuthService';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
});

export const googleLoginSchema = z.object({
  idToken: z.string().min(1, 'Google ID Token wajib disertakan'),
});

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const studentGoogleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { idToken } = req.body;
    const result = await GoogleAuthService.loginWithGoogle(idToken);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const user = await AuthService.getMe(userId);

    res.status(200).json({
      success: true,
      message: 'Profil berhasil diambil',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

