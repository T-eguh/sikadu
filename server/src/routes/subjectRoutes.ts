import { Router } from 'express';
import { SubjectController } from '../controllers/subjectController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticate, SubjectController.getAll);
router.get('/:id', authenticate, SubjectController.getById);
router.post('/', authenticate, authorize('ADMIN'), SubjectController.create);
router.patch('/:id', authenticate, authorize('ADMIN'), SubjectController.update);
router.patch('/:id/status', authenticate, authorize('ADMIN'), SubjectController.updateStatus);

export default router;
