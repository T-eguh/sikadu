import { Router } from 'express';
import { ClassController } from '../controllers/classController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Viewing classes
router.get('/', authenticate, ClassController.getAll);
router.get('/:id', authenticate, ClassController.getById);
router.get('/:id/students', authenticate, ClassController.getStudents);

// Managing classes (Admin only)
router.post('/', authenticate, authorize('ADMIN'), ClassController.create);
router.patch('/:id', authenticate, authorize('ADMIN'), ClassController.update);
router.patch('/:id/status', authenticate, authorize('ADMIN'), ClassController.updateStatus);

// Class Students placement and transfer (Admin only)
router.post('/:id/students', authenticate, authorize('ADMIN'), ClassController.addStudents);
router.delete('/:id/students/:studentId', authenticate, authorize('ADMIN'), ClassController.removeStudent);
router.post('/:id/move-student', authenticate, authorize('ADMIN'), ClassController.moveStudent);

export default router;
