import { apiClient } from './api';
import {
  AcademicYearItem,
  SubjectItem,
  ClassItem,
  TeachingAssignmentItem,
  TeacherClassItem,
  StudentMyClassItem,
  AdminDashboardStats,
} from '../types/academic';

export const AcademicService = {
  // === ACADEMIC YEARS ===
  async getAcademicYears(page = 1, limit = 20, search = ''): Promise<{ data: AcademicYearItem[]; pagination: any }> {
    const params: Record<string, any> = { page, limit };
    if (search.trim()) params.search = search.trim();
    const res = await apiClient.get('/academic-years', { params });
    return res.data;
  },

  async getActiveAcademicYear(): Promise<AcademicYearItem | null> {
    const res = await apiClient.get('/academic-years/active');
    return res.data.data;
  },

  async getAcademicYearById(id: string): Promise<AcademicYearItem> {
    const res = await apiClient.get(`/academic-years/${id}`);
    return res.data.data;
  },

  async createAcademicYear(payload: {
    name: string;
    startDate: string;
    endDate: string;
    isActive?: boolean;
  }): Promise<AcademicYearItem> {
    const res = await apiClient.post('/academic-years', payload);
    return res.data.data;
  },

  async updateAcademicYear(
    id: string,
    payload: { name?: string; startDate?: string; endDate?: string; isActive?: boolean }
  ): Promise<AcademicYearItem> {
    const res = await apiClient.patch(`/academic-years/${id}`, payload);
    return res.data.data;
  },

  async setAcademicYearStatus(id: string, isActive: boolean): Promise<AcademicYearItem> {
    const res = await apiClient.patch(`/academic-years/${id}/status`, { isActive });
    return res.data.data;
  },

  // === SUBJECTS ===
  async getSubjects(page = 1, limit = 50, search = ''): Promise<{ data: SubjectItem[]; pagination: any }> {
    const params: Record<string, any> = { page, limit };
    if (search.trim()) params.search = search.trim();
    const res = await apiClient.get('/subjects', { params });
    return res.data;
  },

  async getSubjectById(id: string): Promise<SubjectItem> {
    const res = await apiClient.get(`/subjects/${id}`);
    return res.data.data;
  },

  async createSubject(payload: {
    name: string;
    code: string;
    description?: string;
    isActive?: boolean;
  }): Promise<SubjectItem> {
    const res = await apiClient.post('/subjects', payload);
    return res.data.data;
  },

  async updateSubject(
    id: string,
    payload: { name?: string; code?: string; description?: string; isActive?: boolean }
  ): Promise<SubjectItem> {
    const res = await apiClient.patch(`/subjects/${id}`, payload);
    return res.data.data;
  },

  async setSubjectStatus(id: string, isActive: boolean): Promise<SubjectItem> {
    const res = await apiClient.patch(`/subjects/${id}/status`, { isActive });
    return res.data.data;
  },

  // === CLASSES ===
  async getClasses(
    page = 1,
    limit = 20,
    search = '',
    grade = '',
    academicYearId = ''
  ): Promise<{ data: ClassItem[]; pagination: any }> {
    const params: Record<string, any> = { page, limit };
    if (search.trim()) params.search = search.trim();
    if (grade.trim()) params.grade = grade.trim();
    if (academicYearId.trim()) params.academicYearId = academicYearId.trim();
    const res = await apiClient.get('/classes', { params });
    return res.data;
  },

  async getClassById(id: string): Promise<ClassItem> {
    const res = await apiClient.get(`/classes/${id}`);
    return res.data.data;
  },

  async createClass(payload: {
    name: string;
    grade: string;
    academicYearId: string;
    homeroomTeacherId?: string | null;
    isActive?: boolean;
  }): Promise<ClassItem> {
    const res = await apiClient.post('/classes', payload);
    return res.data.data;
  },

  async updateClass(
    id: string,
    payload: {
      name?: string;
      grade?: string;
      academicYearId?: string;
      homeroomTeacherId?: string | null;
      isActive?: boolean;
    }
  ): Promise<ClassItem> {
    const res = await apiClient.patch(`/classes/${id}`, payload);
    return res.data.data;
  },

  async setClassStatus(id: string, isActive: boolean): Promise<ClassItem> {
    const res = await apiClient.patch(`/classes/${id}/status`, { isActive });
    return res.data.data;
  },

  async getClassStudents(id: string): Promise<any[]> {
    const res = await apiClient.get(`/classes/${id}/students`);
    return res.data.data;
  },

  async addStudentsToClass(classId: string, studentIds: string[]): Promise<any[]> {
    const res = await apiClient.post(`/classes/${classId}/students`, { studentIds });
    return res.data.data;
  },

  async removeStudentFromClass(classId: string, studentId: string): Promise<{ message: string }> {
    const res = await apiClient.delete(`/classes/${classId}/students/${studentId}`);
    return res.data;
  },

  async moveStudent(fromClassId: string, toClassId: string, studentId: string): Promise<any> {
    const res = await apiClient.post(`/classes/${fromClassId}/move-student`, {
      targetClassId: toClassId,
      studentId,
    });
    return res.data;
  },

  // === TEACHING ASSIGNMENTS ===
  async getTeachingAssignments(
    page = 1,
    limit = 30,
    filters: { teacherId?: string; classId?: string; subjectId?: string; academicYearId?: string } = {}
  ): Promise<{ data: TeachingAssignmentItem[]; pagination: any }> {
    const params = { page, limit, ...filters };
    const res = await apiClient.get('/teaching-assignments', { params });
    return res.data;
  },

  async createTeachingAssignment(payload: {
    teacherId: string;
    classId: string;
    subjectId: string;
    academicYearId: string;
  }): Promise<TeachingAssignmentItem> {
    const res = await apiClient.post('/teaching-assignments', payload);
    return res.data.data;
  },

  async deleteTeachingAssignment(id: string): Promise<{ message: string }> {
    const res = await apiClient.delete(`/teaching-assignments/${id}`);
    return res.data;
  },

  // === GURU: KELAS SAYA ===
  async getTeacherMyClasses(): Promise<TeacherClassItem[]> {
    const res = await apiClient.get('/teacher/my-classes');
    return res.data.data;
  },

  // === SISWA: KELAS SAYA ===
  async getStudentMyClass(): Promise<StudentMyClassItem | null> {
    const res = await apiClient.get('/student/my-class');
    return res.data.data;
  },

  // === ADMIN STATS ===
  async getAdminStats(): Promise<AdminDashboardStats> {
    const res = await apiClient.get('/admin/stats');
    return res.data.data;
  },
};
