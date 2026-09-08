import { Router } from 'express';
import { ModuleContentController } from '../controllers/moduleContentController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Guru / Admin: Update materi
router.patch('/:id', authenticate, authorize('TEACHER', 'ADMIN'), ModuleContentController.updateContent);

// Guru / Admin: Hapus materi
router.delete('/:id', authenticate, authorize('TEACHER', 'ADMIN'), ModuleContentController.deleteContent);

export default router;
