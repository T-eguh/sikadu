import { Router } from 'express';
import {
  TeacherController,
  createTeacherSchema,
  updateTeacherSchema,
  updateStatusSchema,
  resetPasswordSchema,
} from '../controllers/teacherController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// All teacher management routes are strictly restricted to ADMIN
router.use(authenticate, authorize('ADMIN'));

router.get('/', TeacherController.getAll);
router.get('/:id', TeacherController.getById);
router.post('/', validateRequest(createTeacherSchema), TeacherController.create);
router.patch('/:id', validateRequest(updateTeacherSchema), TeacherController.update);
router.patch('/:id/status', validateRequest(updateStatusSchema), TeacherController.updateStatus);
router.patch(
  '/:id/reset-password',
  validateRequest(resetPasswordSchema),
  TeacherController.resetPassword
);

export default router;
