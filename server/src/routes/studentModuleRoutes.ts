import { Router } from 'express';
import { StudentModuleController } from '../controllers/studentModuleController';
import {
  InvitationCodeController,
  joinClassSchema,
} from '../controllers/invitationCodeController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// Siswa: Profil lengkap siswa BISA (GET /api/student/me)
router.get('/me', authenticate, authorize('STUDENT'), StudentModuleController.getProfile);

// Siswa: Bergabung ke kelas menggunakan kode kelas (POST /api/student/join-class)
router.post(
  '/join-class',
  authenticate,
  authorize('STUDENT'),
  validateRequest(joinClassSchema),
  InvitationCodeController.joinClass
);

// Siswa: Mengambil daftar modul kelas yang PUBLISHED (GET /api/student/modules)
router.get('/modules', authenticate, authorize('STUDENT'), StudentModuleController.getModules);

// Siswa: Mengambil detail modul dan materi (GET /api/student/modules/:id)
router.get('/modules/:id', authenticate, authorize('STUDENT'), StudentModuleController.getModuleDetail);

// Siswa: Mengambil status progres modul (GET /api/student/modules/:id/progress)
router.get('/modules/:id/progress', authenticate, authorize('STUDENT'), StudentModuleController.getModuleProgress);

// Siswa: Menandai materi selesai (POST /api/student/module-progress/:contentId/complete)
router.post('/module-progress/:contentId/complete', authenticate, authorize('STUDENT'), StudentModuleController.completeContent);

// Siswa: Membatalkan status selesai (DELETE /api/student/module-progress/:contentId)
router.delete('/module-progress/:contentId', authenticate, authorize('STUDENT'), StudentModuleController.uncompleteContent);

export default router;

