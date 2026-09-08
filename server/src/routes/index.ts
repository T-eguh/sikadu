import { Router } from 'express';
import authRoutes from './authRoutes';
import teacherRoutes from './teacherRoutes';
import studentRoutes from './studentRoutes';
import academicYearRoutes from './academicYearRoutes';
import subjectRoutes from './subjectRoutes';
import classRoutes from './classRoutes';
import teachingAssignmentRoutes from './teachingAssignmentRoutes';
import moduleRoutes from './moduleRoutes';
import moduleContentRoutes from './moduleContentRoutes';
import uploadRoutes from './uploadRoutes';
import studentModuleRoutes from './studentModuleRoutes';
import { TeacherController } from '../controllers/teacherController';
import { StudentController } from '../controllers/studentController';
import { authenticate, authorize } from '../middleware/authMiddleware';
import { prisma } from '../utils/prisma';

const router = Router();

// Health Check Endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
  });
});

// Authentication Routes
router.use('/auth', authRoutes);

// Teacher Management Routes (ADMIN only)
router.use('/teachers', teacherRoutes);

// Student Management Routes (ADMIN only)
router.use('/students', studentRoutes);

// Academic Management Routes
router.use('/academic-years', academicYearRoutes);
router.use('/subjects', subjectRoutes);
router.use('/classes', classRoutes);
router.use('/teaching-assignments', teachingAssignmentRoutes);

// Module & Learning Material Routes (Tahap 4)
router.use('/modules', moduleRoutes);
router.use('/module-contents', moduleContentRoutes);
router.use('/uploads', uploadRoutes);

// Student Learning & Module Routes (Tahap 4)
router.use('/student', studentModuleRoutes);

// Teacher Role Specific Endpoints
router.get('/teacher/my-classes', authenticate, authorize('TEACHER', 'ADMIN'), TeacherController.getMyClasses);

// Student Role Specific Endpoints
router.get('/student/my-class', authenticate, authorize('STUDENT', 'ADMIN'), StudentController.getMyClass);

// Protected Admin Dashboard Stats Endpoint (Updated for Phase 4)
router.get('/admin/stats', authenticate, authorize('ADMIN'), async (_req, res, next) => {
  try {
    const [
      totalTeachers,
      totalStudents,
      totalUsers,
      totalClasses,
      totalSubjects,
      totalTeachingAssignments,
      activeAcademicYear,
      totalModules,
      totalPublishedModules,
      totalPendingReviewModules,
    ] = await Promise.all([
      prisma.teacher.count(),
      prisma.student.count(),
      prisma.user.count(),
      (prisma as any).class.count({ where: { isActive: true } }),
      (prisma as any).subject.count({ where: { isActive: true } }),
      (prisma as any).teachingAssignment.count(),
      (prisma as any).academicYear.findFirst({
        where: { isActive: true },
        select: { id: true, name: true, startDate: true, endDate: true },
      }),
      (prisma as any).module.count(),
      (prisma as any).module.count({ where: { status: 'PUBLISHED' } }),
      (prisma as any).module.count({ where: { status: 'PENDING_REVIEW' } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalTeachers,
        totalStudents,
        totalUsers,
        totalClasses,
        totalSubjects,
        totalTeachingAssignments,
        activeAcademicYear,
        totalModules,
        totalPublishedModules,
        totalPendingReviewModules,
        systemStatus: 'ONLINE',
        version: '4.0.0-phase4',
      },
    });
  } catch (error) {
    next(error);
  }
});


// Protected Teacher Sample Endpoint
router.get('/teacher/summary', authenticate, authorize('ADMIN', 'TEACHER'), (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Akses khusus Guru dan Admin',
    },
  });
});

// Protected Student Sample Endpoint
router.get('/student/summary', authenticate, authorize('ADMIN', 'TEACHER', 'STUDENT'), (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Akses Siswa, Guru, dan Admin',
    },
  });
});

export default router;
