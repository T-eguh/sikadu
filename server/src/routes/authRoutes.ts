import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, getMe, loginSchema } from '../controllers/authController';
import { authenticate } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Rate limiting on login attempts to protect against brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.',
    errors: [],
  },
});

router.post('/login', loginLimiter, validateRequest(loginSchema), login);
router.get('/me', authenticate, getMe);

export default router;
