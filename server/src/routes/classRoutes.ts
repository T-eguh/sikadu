import { Router } from 'express';
import { ClassController } from '../controllers/classController';
import {
  InvitationCodeController,
  createInvitationCodeSchema,
} from '../controllers/invitationCodeController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';

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

// Class Invitation Codes (Admin only - Tahap 4.5)
router.post(
  '/:classId/invitation-codes',
  authenticate,
  authorize('ADMIN'),
  validateRequest(createInvitationCodeSchema),
  InvitationCodeController.createCode
);
router.get(
  '/:classId/invitation-codes',
  authenticate,
  authorize('ADMIN'),
  InvitationCodeController.getCodes
);
router.patch(
  '/:classId/invitation-codes/:codeId/deactivate',
  authenticate,
  authorize('ADMIN'),
  InvitationCodeController.deactivateCode
);
router.post(
  '/:classId/invitation-codes/:codeId/regenerate',
  authenticate,
  authorize('ADMIN'),
  InvitationCodeController.regenerateCode
);

export default router;

