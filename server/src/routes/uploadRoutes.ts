import { Router } from 'express';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { uploadDocument, uploadImage } from '../middleware/uploadMiddleware';
import { UploadController } from '../controllers/uploadController';

const router = Router();

router.post(
  '/module-document',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  uploadDocument.single('file'),
  UploadController.uploadDocument
);

router.post(
  '/module-image',
  authenticate,
  authorize('TEACHER', 'ADMIN'),
  uploadImage.single('file'),
  UploadController.uploadImage
);

export default router;
