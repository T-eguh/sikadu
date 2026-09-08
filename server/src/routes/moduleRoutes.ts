import { Router } from 'express';
import { ModuleController } from '../controllers/moduleController';
import { ModuleContentController } from '../controllers/moduleContentController';
import { authenticate, authorize } from '../middleware/authMiddleware';

const router = Router();

// Guru: Melihat modul saya (GET /api/modules/my)
router.get('/my', authenticate, authorize('TEACHER'), ModuleController.getMy);

// Admin: Melihat semua modul (GET /api/modules)
router.get('/', authenticate, authorize('ADMIN'), ModuleController.getAll);

// Guru: Membuat modul baru (POST /api/modules)
router.post('/', authenticate, authorize('TEACHER'), ModuleController.create);

// Detail modul (Admin, Guru, Siswa)
router.get('/:id', authenticate, ModuleController.getById);

// Guru: Mengedit modul (PATCH /api/modules/:id)
router.patch('/:id', authenticate, authorize('TEACHER'), ModuleController.update);

// Ubah status modul (Guru / Admin) (PATCH /api/modules/:id/status)
router.patch('/:id/status', authenticate, authorize('TEACHER', 'ADMIN'), ModuleController.updateStatus);

// Hapus modul (Guru / Admin) (DELETE /api/modules/:id)
router.delete('/:id', authenticate, authorize('TEACHER', 'ADMIN'), ModuleController.delete);

// Konten dalam modul
router.get('/:id/contents', authenticate, authorize('TEACHER', 'ADMIN'), ModuleContentController.getContents);
router.post('/:id/contents', authenticate, authorize('TEACHER', 'ADMIN'), ModuleContentController.createContent);
router.post('/:id/contents/reorder', authenticate, authorize('TEACHER', 'ADMIN'), ModuleContentController.reorderContents);

export default router;
