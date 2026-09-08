import { Router } from 'express';
import {
  StudentController,
  createStudentSchema,
  updateStudentSchema,
  updateStatusSchema,
  resetPasswordSchema,
} from '../controllers/studentController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// All student management routes are strictly restricted to ADMIN
router.use(authenticate, authorize('ADMIN'));

router.get('/', StudentController.getAll);
router.get('/:id', StudentController.getById);
router.post('/', validateRequest(createStudentSchema), StudentController.create);
router.patch('/:id', validateRequest(updateStudentSchema), StudentController.update);
router.patch('/:id/status', validateRequest(updateStatusSchema), StudentController.updateStatus);
router.patch(
  '/:id/reset-password',
  validateRequest(resetPasswordSchema),
  StudentController.resetPassword
);

export default router;
