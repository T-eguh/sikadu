import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, getMe, loginSchema, studentGoogleLogin, googleLoginSchema } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Rate limiting on login attempts to protect against brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.',
    errors: [],
  },
});

// Admin & Guru Internal Login
router.post('/login', loginLimiter, validateRequest(loginSchema), login);

// Siswa Google Sign-In (Tahap 4.5)
router.post('/student/google', loginLimiter, validateRequest(googleLoginSchema), studentGoogleLogin);

// Current User Profile
router.get('/me', authenticate, getMe);

export default router;

