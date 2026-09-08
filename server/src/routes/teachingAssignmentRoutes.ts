import { Router } from 'express';
import { TeachingAssignmentController } from '../controllers/teachingAssignmentController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// All teaching assignment management requires ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/', TeachingAssignmentController.getAll);
router.get('/:id', TeachingAssignmentController.getById);
router.post('/', TeachingAssignmentController.create);
router.patch('/:id', TeachingAssignmentController.update);
router.delete('/:id', TeachingAssignmentController.delete);

export default router;
