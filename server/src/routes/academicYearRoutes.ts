import { Router } from 'express';
import { AcademicYearController } from '../controllers/academicYearController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Active academic year can be viewed by all authenticated users
router.get('/active', authenticate, AcademicYearController.getActive);

// All management endpoints require ADMIN role
router.get('/', authenticate, authorize('ADMIN'), AcademicYearController.getAll);
router.get('/:id', authenticate, authorize('ADMIN'), AcademicYearController.getById);
router.post('/', authenticate, authorize('ADMIN'), AcademicYearController.create);
router.patch('/:id', authenticate, authorize('ADMIN'), AcademicYearController.update);
router.patch('/:id/status', authenticate, authorize('ADMIN'), AcademicYearController.updateStatus);

export default router;
