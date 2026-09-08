import { User, Role, AcademicYear, Subject, ClassItem, TeachingAssignment, ModuleItem, ModuleContent, ModuleStatus, ContentType } from './types';

export const SEED_USERS: Array<User & { password: string }> = [
  {
    id: 'usr-admin-01',
    name: 'Administrator Utama',
    email: 'admin@sekolahmodel.sch.id',
    password: 'Admin123!',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    isActive: true,
    createdAt: '2024-01-01T08:00:00.000Z',
  },
  {
    id: 'usr-teacher-01',
    name: 'Budi Santoso, S.Pd.',
    email: 'guru.budi@sekolahmodel.sch.id',
    password: 'Guru123!',
    role: 'TEACHER',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    isActive: true,
    createdAt: '2024-01-10T09:00:00.000Z',
    teacher: {
      id: 'tch-01',
      teacherNumber: '198501152010011001',
    },
  },
  {
    id: 'usr-teacher-02',
    name: 'Siti Rahmawati, M.Pd.',
    email: 'guru.siti@sekolahmodel.sch.id',
    password: 'Guru123!',
    role: 'TEACHER',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    isActive: true,
    createdAt: '2024-01-12T10:30:00.000Z',
    teacher: {
      id: 'tch-02',
      teacherNumber: '198803202012022002',
    },
  },
  {
    id: 'usr-student-01',
    name: 'Ahmad Fauzi',
    email: 'siswa.ahmad@sekolahmodel.sch.id',
    password: 'Siswa123!',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    isActive: true,
    createdAt: '2024-02-01T08:15:00.000Z',
    student: {
      id: 'std-01',
      studentNumber: '24001',
      nisn: '0071234561',
    },
  },
  {
    id: 'usr-student-02',
    name: 'Dewi Lestari',
    email: 'siswa.dewi@sekolahmodel.sch.id',
    password: 'Siswa123!',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    isActive: true,
    createdAt: '2024-02-02T08:30:00.000Z',
    student: {
      id: 'std-02',
      studentNumber: '24002',
      nisn: '0071234562',
    },
  },
  {
    id: 'usr-student-03',
    name: 'Reza Pratama',
    email: 'siswa.reza@sekolahmodel.sch.id',
    password: 'Siswa123!',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    isActive: true,
    createdAt: '2024-02-03T09:00:00.000Z',
    student: {
      id: 'std-03',
      studentNumber: '24003',
      nisn: '0071234563',
    },
  },
  {
    id: 'usr-student-04',
    name: 'Anisa Nurul',
    email: 'siswa.anisa@sekolahmodel.sch.id',
    password: 'Siswa123!',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    isActive: true,
    createdAt: '2024-02-04T09:20:00.000Z',
    student: {
      id: 'std-04',
      studentNumber: '24004',
      nisn: '0071234564',
    },
  },
  {
    id: 'usr-student-05',
    name: 'Fajar Hidayat',
    email: 'siswa.fajar@sekolahmodel.sch.id',
    password: 'Siswa123!',
    role: 'STUDENT',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    isActive: true,
    createdAt: '2024-02-05T10:00:00.000Z',
    student: {
      id: 'std-05',
      studentNumber: '24005',
      nisn: '0071234565',
    },
  },
];

export const TOKEN_STORAGE_KEY = 'sekolah_model_auth_token';

let memoryUsers = [...SEED_USERS];

export const mockBackend = {
  async login(email: string, pass: string): Promise<{ token: string; user: User }> {
    await new Promise((r) => setTimeout(r, 400));

    const target = memoryUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );

    if (!target || target.password !== pass) {
      throw new Error('Email atau kata sandi tidak valid.');
    }

    if (!target.isActive) {
      throw new Error('Akun Anda dinonaktifkan. Silakan hubungi Administrator.');
    }

    const token = `jwt_header.${btoa(JSON.stringify({ userId: target.id, role: target.role, exp: Date.now() + 7 * 86400000 }))}.sig`;
    const { password, ...safeUser } = target;
    return { token, user: safeUser };
  },

  async getMe(token: string): Promise<User> {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const parts = token.split('.');
      if (parts.length < 2) throw new Error('Invalid token');
      const payload = JSON.parse(atob(parts[1]));
      
      const target = memoryUsers.find((u) => u.id === payload.userId);
      if (!target) throw new Error('Pengguna tidak ditemukan');
      if (!target.isActive) throw new Error('Akun tidak aktif');

      const { password, ...safeUser } = target;
      return safeUser;
    } catch {
      throw new Error('Token tidak valid atau kedaluwarsa');
    }
  },

  async getStats() {
    const totalTeachers = memoryUsers.filter((u) => u.role === 'TEACHER').length;
    const totalStudents = memoryUsers.filter((u) => u.role === 'STUDENT').length;
    const totalUsers = memoryUsers.length;
    return {
      totalTeachers,
      totalStudents,
      totalUsers,
      systemStatus: 'ONLINE',
    };
  },

  async getTeachers(search = '') {
    await new Promise((r) => setTimeout(r, 200));
    let list = memoryUsers.filter((u) => u.role === 'TEACHER');
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          (u.teacher?.teacherNumber && u.teacher.teacherNumber.includes(s))
      );
    }
    return list.map(({ password, ...u }) => u);
  },

  async createTeacher(payload: { name: string; email: string; teacherNumber: string; password: string }) {
    await new Promise((r) => setTimeout(r, 400));
    if (memoryUsers.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error('Email sudah digunakan oleh akun lain.');
    }
    if (memoryUsers.some((u) => u.teacher?.teacherNumber === payload.teacherNumber)) {
      throw new Error('Nomor Induk Guru (NIP) sudah terdaftar.');
    }

    const newUser: User & { password: string } = {
      id: `usr-teacher-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: 'TEACHER',
      isActive: true,
      createdAt: new Date().toISOString(),
      teacher: {
        id: `tch-${Date.now()}`,
        teacherNumber: payload.teacherNumber,
      },
    };
    memoryUsers.unshift(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  },

  async updateTeacher(id: string, payload: { name?: string; email?: string; teacherNumber?: string }) {
    await new Promise((r) => setTimeout(r, 300));
    const target = memoryUsers.find((u) => u.id === id);
    if (!target) throw new Error('Data guru tidak ditemukan');

    if (payload.email && payload.email !== target.email) {
      if (memoryUsers.some((u) => u.id !== id && u.email.toLowerCase() === payload.email!.toLowerCase())) {
        throw new Error('Email sudah digunakan oleh akun lain.');
      }
      target.email = payload.email;
    }
    if (payload.name) target.name = payload.name;
    if (payload.teacherNumber && target.teacher) {
      if (memoryUsers.some((u) => u.id !== id && u.teacher?.teacherNumber === payload.teacherNumber)) {
        throw new Error('Nomor Induk Guru (NIP) sudah terdaftar.');
      }
      target.teacher.teacherNumber = payload.teacherNumber;
    }

    const { password, ...safeUser } = target;
    return safeUser;
  },

  async getStudents(search = '') {
    await new Promise((r) => setTimeout(r, 200));
    let list = memoryUsers.filter((u) => u.role === 'STUDENT');
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          (u.student?.studentNumber && u.student.studentNumber.includes(s)) ||
          (u.student?.nisn && u.student.nisn.includes(s))
      );
    }
    return list.map(({ password, ...u }) => u);
  },

  async createStudent(payload: {
    name: string;
    email: string;
    studentNumber: string;
    nisn: string;
    password: string;
  }) {
    await new Promise((r) => setTimeout(r, 400));
    if (memoryUsers.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      throw new Error('Email sudah digunakan oleh akun lain.');
    }
    if (memoryUsers.some((u) => u.student?.studentNumber === payload.studentNumber)) {
      throw new Error('Nomor Induk Siswa (NIS) sudah terdaftar.');
    }
    if (memoryUsers.some((u) => u.student?.nisn === payload.nisn)) {
      throw new Error('NISN sudah terdaftar.');
    }

    const newUser: User & { password: string } = {
      id: `usr-student-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: 'STUDENT',
      isActive: true,
      createdAt: new Date().toISOString(),
      student: {
        id: `std-${Date.now()}`,
        studentNumber: payload.studentNumber,
        nisn: payload.nisn,
      },
    };
    memoryUsers.unshift(newUser);
    const { password, ...safeUser } = newUser;
    return safeUser;
  },

  async updateStudent(
    id: string,
    payload: { name?: string; email?: string; studentNumber?: string; nisn?: string }
  ) {
    await new Promise((r) => setTimeout(r, 300));
    const target = memoryUsers.find((u) => u.id === id);
    if (!target) throw new Error('Data siswa tidak ditemukan');

    if (payload.email && payload.email !== target.email) {
      if (memoryUsers.some((u) => u.id !== id && u.email.toLowerCase() === payload.email!.toLowerCase())) {
        throw new Error('Email sudah digunakan oleh akun lain.');
      }
      target.email = payload.email;
    }
    if (payload.name) target.name = payload.name;
    if (payload.studentNumber && target.student) {
      if (memoryUsers.some((u) => u.id !== id && u.student?.studentNumber === payload.studentNumber)) {
        throw new Error('Nomor Induk Siswa (NIS) sudah terdaftar.');
      }
      target.student.studentNumber = payload.studentNumber;
    }
    if (payload.nisn && target.student) {
      if (memoryUsers.some((u) => u.id !== id && u.student?.nisn === payload.nisn)) {
        throw new Error('NISN sudah terdaftar.');
      }
      target.student.nisn = payload.nisn;
    }

    const { password, ...safeUser } = target;
    return safeUser;
  },

  async updateStatus(id: string, isActive: boolean) {
    await new Promise((r) => setTimeout(r, 250));
    const target = memoryUsers.find((u) => u.id === id);
    if (!target) throw new Error('Pengguna tidak ditemukan');
    target.isActive = isActive;
    const { password, ...safeUser } = target;
    return safeUser;
  },

  async resetPassword(id: string, newPass: string) {
    await new Promise((r) => setTimeout(r, 300));
    const target = memoryUsers.find((u) => u.id === id);
    if (!target) throw new Error('Pengguna tidak ditemukan');
    if (newPass.length < 6) throw new Error('Kata sandi baru minimal 6 karakter.');
    target.password = newPass;
    return { success: true, message: 'Kata sandi berhasil direset.' };
  },

  // Academic Seeds & APIs (Tahap 3)
  async getAcademicYears() {
    await new Promise((r) => setTimeout(r, 200));
    return memoryAcademicYears;
  },

  async createAcademicYear(payload: { name: string; semester: 'GANJIL' | 'GENAP'; startDate: string; endDate: string; isActive?: boolean }) {
    await new Promise((r) => setTimeout(r, 300));
    if (payload.isActive) {
      memoryAcademicYears.forEach((y) => (y.isActive = false));
    }
    const newAy: AcademicYear = {
      id: `ay-${Date.now()}`,
      name: payload.name,
      semester: payload.semester,
      isActive: payload.isActive ?? false,
      startDate: payload.startDate,
      endDate: payload.endDate,
      _count: { classes: 0, teachingAssignments: 0 },
    };
    memoryAcademicYears.unshift(newAy);
    return newAy;
  },

  async updateAcademicYearStatus(id: string, isActive: boolean) {
    await new Promise((r) => setTimeout(r, 200));
    if (isActive) {
      memoryAcademicYears.forEach((y) => (y.isActive = false));
    }
    const target = memoryAcademicYears.find((y) => y.id === id);
    if (!target) throw new Error('Tahun ajaran tidak ditemukan');
    target.isActive = isActive;
    return target;
  },

  async getSubjects(search?: string) {
    await new Promise((r) => setTimeout(r, 200));
    let list = [...memorySubjects];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
    }
    return list;
  },

  async createSubject(payload: { name: string; code: string; description?: string }) {
    await new Promise((r) => setTimeout(r, 300));
    if (memorySubjects.some((s) => s.code.toUpperCase() === payload.code.toUpperCase())) {
      throw new Error(`Kode mata pelajaran "${payload.code}" sudah terdaftar.`);
    }
    const newSubj: Subject = {
      id: `subj-${Date.now()}`,
      name: payload.name,
      code: payload.code.toUpperCase(),
      description: payload.description,
      isActive: true,
      _count: { teachingAssignments: 0 },
    };
    memorySubjects.unshift(newSubj);
    return newSubj;
  },

  async updateSubjectStatus(id: string, isActive: boolean) {
    await new Promise((r) => setTimeout(r, 200));
    const target = memorySubjects.find((s) => s.id === id);
    if (!target) throw new Error('Mata pelajaran tidak ditemukan');
    target.isActive = isActive;
    return target;
  },

  async getClasses(grade?: number) {
    await new Promise((r) => setTimeout(r, 250));
    let list = memoryClasses.map((c) => {
      const ay = memoryAcademicYears.find((y) => y.id === c.academicYearId);
      const ht = c.homeroomTeacherId
        ? memoryUsers.find((u) => u.teacher?.id === c.homeroomTeacherId)
        : null;
      const enrolled = memoryClassStudents.filter((cs) => cs.classId === c.id);
      const assignments = memoryTeachingAssignments.filter((ta) => ta.classId === c.id);
      return {
        ...c,
        academicYear: ay ? { id: ay.id, name: ay.name, semester: ay.semester } : undefined,
        homeroomTeacher: ht && ht.teacher ? {
          id: ht.teacher.id,
          teacherNumber: ht.teacher.teacherNumber,
          user: { name: ht.name, email: ht.email },
        } : null,
        _count: {
          students: enrolled.length,
          teachingAssignments: assignments.length,
        },
      };
    });

    if (grade) {
      list = list.filter((c) => c.grade === grade);
    }
    return list;
  },

  async getClassById(id: string) {
    await new Promise((r) => setTimeout(r, 250));
    const c = memoryClasses.find((cls) => cls.id === id);
    if (!c) throw new Error('Kelas tidak ditemukan');
    const ay = memoryAcademicYears.find((y) => y.id === c.academicYearId);
    const ht = c.homeroomTeacherId
      ? memoryUsers.find((u) => u.teacher?.id === c.homeroomTeacherId)
      : null;

    const enrolled = memoryClassStudents
      .filter((cs) => cs.classId === c.id)
      .map((cs) => {
        const u = memoryUsers.find((user) => user.student?.id === cs.studentId);
        return {
          id: cs.id,
          classId: cs.classId,
          studentId: cs.studentId,
          student: {
            id: cs.studentId,
            studentNumber: u?.student?.studentNumber || '',
            nisn: u?.student?.nisn || '',
            user: {
              id: u?.id || '',
              name: u?.name || '',
              email: u?.email || '',
            },
          },
        };
      });

    const assignments = memoryTeachingAssignments
      .filter((ta) => ta.classId === c.id)
      .map((ta) => {
        const tUser = memoryUsers.find((u) => u.teacher?.id === ta.teacherId);
        const subj = memorySubjects.find((s) => s.id === ta.subjectId);
        return {
          id: ta.id,
          teacher: {
            user: {
              name: tUser?.name || '',
            },
          },
          subject: {
            name: subj?.name || '',
            code: subj?.code || '',
          },
        };
      });

    return {
      ...c,
      academicYear: ay ? { id: ay.id, name: ay.name, semester: ay.semester } : undefined,
      homeroomTeacher: ht && ht.teacher ? {
        id: ht.teacher.id,
        teacherNumber: ht.teacher.teacherNumber,
        user: { name: ht.name, email: ht.email },
      } : null,
      students: enrolled,
      teachingAssignments: assignments,
      _count: {
        students: enrolled.length,
        teachingAssignments: assignments.length,
      },
    };
  },

  async createClass(payload: { name: string; grade: number; academicYearId: string; homeroomTeacherId?: string }) {
    await new Promise((r) => setTimeout(r, 300));
    const newClass = {
      id: `cls-${Date.now()}`,
      name: payload.name,
      grade: payload.grade,
      academicYearId: payload.academicYearId,
      homeroomTeacherId: payload.homeroomTeacherId || null,
      isActive: true,
    };
    memoryClasses.unshift(newClass);
    return newClass;
  },

  async addStudentsToClass(classId: string, studentUserIds: string[]) {
    await new Promise((r) => setTimeout(r, 300));
    const c = memoryClasses.find((cls) => cls.id === classId);
    if (!c) throw new Error('Kelas tidak ditemukan');

    for (const userId of studentUserIds) {
      const u = memoryUsers.find((usr) => usr.id === userId);
      if (!u || !u.student) continue;

      // Check if already in another class in the same academic year
      const existingInYear = memoryClassStudents.find((cs) => {
        const otherC = memoryClasses.find((cls) => cls.id === cs.classId);
        return otherC?.academicYearId === c.academicYearId && cs.studentId === u.student!.id;
      });

      if (existingInYear) {
        throw new Error(`Siswa ${u.name} sudah terdaftar pada kelas lain di Tahun Ajaran ini.`);
      }

      memoryClassStudents.push({
        id: `cs-${Date.now()}-${Math.random()}`,
        classId,
        studentId: u.student.id,
      });
    }

    return { success: true, message: 'Siswa berhasil ditambahkan ke kelas.' };
  },

  async removeStudentFromClass(classId: string, studentId: string) {
    await new Promise((r) => setTimeout(r, 250));
    memoryClassStudents = memoryClassStudents.filter(
      (cs) => !(cs.classId === classId && cs.studentId === studentId)
    );
    return { success: true };
  },

  async moveStudent(fromClassId: string, toClassId: string, studentId: string) {
    await new Promise((r) => setTimeout(r, 300));
    memoryClassStudents = memoryClassStudents.filter(
      (cs) => !(cs.classId === fromClassId && cs.studentId === studentId)
    );
    memoryClassStudents.push({
      id: `cs-${Date.now()}`,
      classId: toClassId,
      studentId,
    });
    return { success: true };
  },

  async getTeachingAssignments(filter?: { teacherId?: string }) {
    await new Promise((r) => setTimeout(r, 250));
    let list = memoryTeachingAssignments;
    if (filter?.teacherId) {
      list = list.filter((ta) => ta.teacherId === filter.teacherId);
    }
    return list.map((ta) => {
      const tUser = memoryUsers.find((u) => u.teacher?.id === ta.teacherId);
      const c = memoryClasses.find((cls) => cls.id === ta.classId);
      const subj = memorySubjects.find((s) => s.id === ta.subjectId);
      const ay = memoryAcademicYears.find((y) => y.id === ta.academicYearId);
      const studentsCount = memoryClassStudents.filter((cs) => cs.classId === ta.classId).length;

      return {
        id: ta.id,
        teacherId: ta.teacherId,
        teacher: {
          id: ta.teacherId,
          teacherNumber: tUser?.teacher?.teacherNumber || '',
          user: { name: tUser?.name || '', email: tUser?.email || '' },
        },
        classId: ta.classId,
        class: {
          id: ta.classId,
          name: c?.name || '',
          grade: c?.grade || 10,
          _count: { students: studentsCount },
        },
        subjectId: ta.subjectId,
        subject: {
          id: ta.subjectId,
          name: subj?.name || '',
          code: subj?.code || '',
        },
        academicYearId: ta.academicYearId,
        academicYear: {
          id: ta.academicYearId,
          name: ay?.name || '',
        },
      };
    });
  },

  async createTeachingAssignment(payload: { teacherId: string; classId: string; subjectId: string; academicYearId: string }) {
    await new Promise((r) => setTimeout(r, 300));
    const exists = memoryTeachingAssignments.some(
      (ta) =>
        ta.teacherId === payload.teacherId &&
        ta.classId === payload.classId &&
        ta.subjectId === payload.subjectId &&
        ta.academicYearId === payload.academicYearId
    );
    if (exists) {
      throw new Error('Penugasan mengajar dengan kombinasi guru, kelas, mapel, dan tahun ajaran tersebut sudah ada.');
    }

    const newTa = {
      id: `ta-${Date.now()}`,
      ...payload,
    };
    memoryTeachingAssignments.unshift(newTa);
    return newTa;
  },

  async deleteTeachingAssignment(id: string) {
    await new Promise((r) => setTimeout(r, 250));
    memoryTeachingAssignments = memoryTeachingAssignments.filter((ta) => ta.id !== id);
    return { success: true };
  },

  async getTeacherMyClasses(teacherUserId: string) {
    await new Promise((r) => setTimeout(r, 250));
    const user = memoryUsers.find((u) => u.id === teacherUserId);
    const teacherId = user?.teacher?.id;
    if (!teacherId) return [];

    const assignments = memoryTeachingAssignments.filter((ta) => ta.teacherId === teacherId);
    return assignments.map((ta) => {
      const c = memoryClasses.find((cls) => cls.id === ta.classId);
      const subj = memorySubjects.find((s) => s.id === ta.subjectId);
      const ay = memoryAcademicYears.find((y) => y.id === ta.academicYearId);
      const enrolled = memoryClassStudents
        .filter((cs) => cs.classId === ta.classId)
        .map((cs) => {
          const u = memoryUsers.find((usr) => usr.student?.id === cs.studentId);
          return {
            id: cs.studentId,
            name: u?.name || '',
            studentNumber: u?.student?.studentNumber || '',
            nisn: u?.student?.nisn || '',
          };
        });

      return {
        id: ta.id,
        classId: ta.classId,
        className: c?.name || '',
        grade: c?.grade || 10,
        subjectName: subj?.name || '',
        subjectCode: subj?.code || '',
        academicYearName: ay?.name || '',
        totalStudents: enrolled.length,
        students: enrolled,
      };
    });
  },

  async getStudentMyClass(studentUserId: string) {
    await new Promise((r) => setTimeout(r, 250));
    const user = memoryUsers.find((u) => u.id === studentUserId);
    const studentId = user?.student?.id;
    if (!studentId) return null;

    // Find class membership
    const membership = memoryClassStudents.find((cs) => cs.studentId === studentId);
    if (!membership) return null;

    const c = memoryClasses.find((cls) => cls.id === membership.classId);
    if (!c) return null;

    const ay = memoryAcademicYears.find((y) => y.id === c.academicYearId);
    const ht = c.homeroomTeacherId
      ? memoryUsers.find((u) => u.teacher?.id === c.homeroomTeacherId)
      : null;

    const classmates = memoryClassStudents
      .filter((cs) => cs.classId === c.id)
      .map((cs) => {
        const u = memoryUsers.find((usr) => usr.student?.id === cs.studentId);
        return {
          id: cs.studentId,
          name: u?.name || '',
          studentNumber: u?.student?.studentNumber || '',
          nisn: u?.student?.nisn || '',
          isMe: cs.studentId === studentId,
        };
      });

    const assignments = memoryTeachingAssignments
      .filter((ta) => ta.classId === c.id)
      .map((ta) => {
        const tUser = memoryUsers.find((u) => u.teacher?.id === ta.teacherId);
        const subj = memorySubjects.find((s) => s.id === ta.subjectId);
        return {
          id: ta.id,
          subjectName: subj?.name || '',
          subjectCode: subj?.code || '',
          teacherName: tUser?.name || '',
        };
      });

    return {
      id: c.id,
      name: c.name,
      grade: c.grade,
      academicYear: ay ? { id: ay.id, name: ay.name, semester: ay.semester } : null,
      homeroomTeacher: ht ? { id: ht.id, name: ht.name, email: ht.email } : null,
      classmates,
      totalClassmates: classmates.length,
      subjects: assignments,
    };
  },
};

// Initial academic state in memory
let memoryAcademicYears: AcademicYear[] = [
  {
    id: 'ay-01',
    name: '2026/2027 Ganjil',
    semester: 'GANJIL',
    isActive: true,
    startDate: '2026-07-15T00:00:00.000Z',
    endDate: '2026-12-20T00:00:00.000Z',
    _count: { classes: 2, teachingAssignments: 2 },
  },
  {
    id: 'ay-02',
    name: '2025/2026 Genap',
    semester: 'GENAP',
    isActive: false,
    startDate: '2026-01-10T00:00:00.000Z',
    endDate: '2026-06-25T00:00:00.000Z',
    _count: { classes: 0, teachingAssignments: 0 },
  },
];

let memorySubjects: Subject[] = [
  {
    id: 'subj-01',
    name: 'Matematika Wajib',
    code: 'MTK-10',
    description: 'Matematika Umum tingkat X',
    isActive: true,
    _count: { teachingAssignments: 2 },
  },
  {
    id: 'subj-02',
    name: 'Bahasa Indonesia',
    code: 'BIN-10',
    description: 'Pendidikan Bahasa dan Sastra Indonesia',
    isActive: true,
    _count: { teachingAssignments: 1 },
  },
  {
    id: 'subj-03',
    name: 'Bahasa Inggris',
    code: 'BIG-10',
    description: 'English for Communication',
    isActive: true,
    _count: { teachingAssignments: 0 },
  },
  {
    id: 'subj-04',
    name: 'Fisika Dasar',
    code: 'FIS-10',
    description: 'Fisika tingkat X MIPA',
    isActive: true,
    _count: { teachingAssignments: 0 },
  },
];

let memoryClasses: Array<{
  id: string;
  name: string;
  grade: number;
  academicYearId: string;
  homeroomTeacherId: string | null;
  isActive: boolean;
}> = [
  {
    id: 'cls-01',
    name: 'X-MIPA-1',
    grade: 10,
    academicYearId: 'ay-01',
    homeroomTeacherId: 'tch-01',
    isActive: true,
  },
  {
    id: 'cls-02',
    name: 'X-MIPA-2',
    grade: 10,
    academicYearId: 'ay-01',
    homeroomTeacherId: 'tch-02',
    isActive: true,
  },
];

let memoryClassStudents: Array<{
  id: string;
  classId: string;
  studentId: string;
}> = [
  { id: 'cs-01', classId: 'cls-01', studentId: 'std-01' },
  { id: 'cs-02', classId: 'cls-01', studentId: 'std-02' },
  { id: 'cs-03', classId: 'cls-01', studentId: 'std-03' },
  { id: 'cs-04', classId: 'cls-02', studentId: 'std-04' },
  { id: 'cs-05', classId: 'cls-02', studentId: 'std-05' },
];

let memoryTeachingAssignments: Array<{
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  academicYearId: string;
}> = [
  {
    id: 'ta-01',
    teacherId: 'tch-01',
    classId: 'cls-01',
    subjectId: 'subj-01',
    academicYearId: 'ay-01',
  },
  {
    id: 'ta-02',
    teacherId: 'tch-02',
    classId: 'cls-01',
    subjectId: 'subj-02',
    academicYearId: 'ay-01',
  },
];

let memoryModules: ModuleItem[] = [
  {
    id: 'mod-01',
    title: 'Persamaan & Pertidaksamaan Linear Satu Variabel',
    description: 'Konsep dasar aljabar, penyelesaian sistem persamaan linear, dan penerapannya dalam kehidupan sehari-hari.',
    learningObjectives: 'Siswa mampu memahami konsep persamaan linear, menentukan himpunan penyelesaian, dan memodelkan masalah kontekstual.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500',
    status: 'PUBLISHED',
    teacherId: 'tch-01',
    teachingAssignmentId: 'ta-01',
    classId: 'cls-01',
    subjectId: 'subj-01',
    academicYearId: 'ay-01',
    createdAt: '2024-07-15T08:00:00.000Z',
    updatedAt: '2024-07-20T10:00:00.000Z',
    publishedAt: '2024-07-20T10:00:00.000Z',
  },
  {
    id: 'mod-02',
    title: 'Teks Laporan Hasil Observasi (LHO)',
    description: 'Struktur, kaidah kebahasaan, dan teknik penulisan laporan hasil observasi ilmiah secara kritis dan obyektif.',
    learningObjectives: 'Siswa dapat mengidentifikasi struktur teks LHO, menganalisis kaidah kebahasaan, dan menyusun teks LHO sesuai kaidah.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500',
    status: 'PUBLISHED',
    teacherId: 'tch-02',
    teachingAssignmentId: 'ta-02',
    classId: 'cls-01',
    subjectId: 'subj-02',
    academicYearId: 'ay-01',
    createdAt: '2024-07-18T09:00:00.000Z',
    updatedAt: '2024-07-22T11:00:00.000Z',
    publishedAt: '2024-07-22T11:00:00.000Z',
  },
  {
    id: 'mod-03',
    title: 'Matriks & Transformasi Geometri Dasar',
    description: 'Operasi matriks, determinan, invers matriks 2x2, serta representasi aljabar rotasi dan refleksi.',
    learningObjectives: 'Siswa mampu mengoperasikan perkalian matriks dan menentukan determinan ordo 2x2.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500',
    status: 'DRAFT',
    teacherId: 'tch-01',
    teachingAssignmentId: 'ta-01',
    classId: 'cls-01',
    subjectId: 'subj-01',
    academicYearId: 'ay-01',
    createdAt: '2024-08-01T14:00:00.000Z',
    updatedAt: '2024-08-01T14:00:00.000Z',
    publishedAt: null,
  },
];

let memoryModuleContents: ModuleContent[] = [
  {
    id: 'mc-01',
    moduleId: 'mod-01',
    title: 'Pengenalan Variabel dan Persamaan Linear',
    description: 'Materi bacaan ringkas mengenai definisi variabel, koefisien, konstanta, dan bentuk umum persamaan linear.',
    contentType: 'TEXT',
    textContent: `# Pengenalan Persamaan Linear Satu Variabel (PLSV)

Persamaan linear satu variabel adalah kalimat terbuka yang dihubungkan dengan tanda sama dengan (=) dan hanya memiliki satu variabel berpangkat satu.

### Bentuk Umum:
\`\`\`
ax + b = 0
\`\`\`
dengan:
* a ≠ 0 (a adalah koefisien)
* b adalah konstanta
* x adalah variabel

### Contoh:
1. 2x + 4 = 10
   * 2x = 10 - 4
   * 2x = 6
   * x = 3

Silakan pelajari langkah-langkah di atas sebelum beralih ke materi video pembahasan.`,
    fileUrl: null,
    videoUrl: null,
    imageUrl: null,
    orderNumber: 1,
    createdAt: '2024-07-15T08:30:00.000Z',
    updatedAt: '2024-07-15T08:30:00.000Z',
  },
  {
    id: 'mc-02',
    moduleId: 'mod-01',
    title: 'Infografis Rumus dan Sifat Aljabar',
    description: 'Visualisasi peta konsep sifat penjumlahan, pengurangan, dan perkalian pada persamaan linear.',
    contentType: 'IMAGE',
    textContent: null,
    fileUrl: null,
    videoUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    orderNumber: 2,
    createdAt: '2024-07-15T09:00:00.000Z',
    updatedAt: '2024-07-15T09:00:00.000Z',
  },
  {
    id: 'mc-03',
    moduleId: 'mod-01',
    title: 'Video Kuliah Singkat: Strategi Menyelesaikan Soal Cerita',
    description: 'Panduan video interaktif membedah soal kontekstual aljabar ke dalam bentuk matematis.',
    contentType: 'VIDEO',
    textContent: null,
    fileUrl: null,
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    imageUrl: null,
    orderNumber: 3,
    createdAt: '2024-07-16T10:00:00.000Z',
    updatedAt: '2024-07-16T10:00:00.000Z',
  },
  {
    id: 'mc-04',
    moduleId: 'mod-01',
    title: 'Buku Pegangan Siswa & Latihan Mandiri (PDF)',
    description: 'Dokumen panduan lengkap memuat rangkuman materi dan 20 bank soal latihan mandiri berserta kunci.',
    contentType: 'DOCUMENT',
    textContent: null,
    fileUrl: '/uploads/modules/documents/doc-Modul-Matematika-X-PLSV.pdf',
    videoUrl: null,
    imageUrl: null,
    orderNumber: 4,
    createdAt: '2024-07-17T11:00:00.000Z',
    updatedAt: '2024-07-17T11:00:00.000Z',
  },
  {
    id: 'mc-05',
    moduleId: 'mod-02',
    title: 'Struktur Teks Laporan Hasil Observasi',
    description: 'Penjelasan tiga unsur utama: Pernyataan umum, Deskripsi bagian, dan Deskripsi manfaat.',
    contentType: 'TEXT',
    textContent: `# Struktur Teks LHO

Teks Laporan Hasil Observasi memiliki tiga struktur pokok:
1. **Pernyataan Umum (Definisi Umum)**: Berisi pembukaan, informasi umum tentang objek yang diamati.
2. **Deskripsi Bagian**: Menjelaskan aspek detail dari objek seperti ciri fisik, habitat, atau karakteristik.
3. **Deskripsi Manfaat/Kesimpulan**: Menjelaskan kegunaan, fungsi, atau simpulan dari objek tersebut bagi kehidupan manusia.`,
    fileUrl: null,
    videoUrl: null,
    imageUrl: null,
    orderNumber: 1,
    createdAt: '2024-07-18T09:30:00.000Z',
    updatedAt: '2024-07-18T09:30:00.000Z',
  },
  {
    id: 'mc-06',
    moduleId: 'mod-02',
    title: 'Pedoman Penulisan Ilmiah Populer (PDF)',
    description: 'Dokumen format panduan penyusunan laporan observasi standar kurikulum nasional.',
    contentType: 'DOCUMENT',
    textContent: null,
    fileUrl: '/uploads/modules/documents/doc-Pedoman-LHO-Kelas-X.pdf',
    videoUrl: null,
    imageUrl: null,
    orderNumber: 2,
    createdAt: '2024-07-19T10:00:00.000Z',
    updatedAt: '2024-07-19T10:00:00.000Z',
  },
];

let memoryModuleProgress: Array<{
  id: string;
  studentId: string;
  moduleId: string;
  moduleContentId: string;
  isCompleted: boolean;
  completedAt: string | null;
}> = [
  {
    id: 'mp-01',
    studentId: 'std-01',
    moduleId: 'mod-01',
    moduleContentId: 'mc-01',
    isCompleted: true,
    completedAt: '2024-07-21T08:00:00.000Z',
  },
  {
    id: 'mp-02',
    studentId: 'std-01',
    moduleId: 'mod-01',
    moduleContentId: 'mc-02',
    isCompleted: true,
    completedAt: '2024-07-21T08:30:00.000Z',
  },
];

// Helper to enrich a module with related names
const enrichModule = (m: ModuleItem): ModuleItem => {
  const teacherUser = memoryUsers.find((u) => u.teacher?.id === m.teacherId);
  const cls = memoryClasses.find((c) => c.id === m.classId);
  const subj = memorySubjects.find((s) => s.id === m.subjectId);
  const ay = memoryAcademicYears.find((a) => a.id === m.academicYearId);
  const contents = memoryModuleContents
    .filter((c) => c.moduleId === m.id)
    .sort((a, b) => a.orderNumber - b.orderNumber);

  return {
    ...m,
    teacherName: teacherUser?.name || 'Guru',
    teacherAvatar: teacherUser?.avatar || null,
    className: cls?.name || 'Kelas',
    classGrade: cls?.grade || 10,
    subjectName: subj?.name || 'Mata Pelajaran',
    subjectCode: subj?.code || '',
    academicYearName: ay?.name || 'Tahun Ajaran',
    totalContents: contents.length,
    contents,
  };
};

export const moduleApi = {
  // Ambil penugasan mengajar milik guru
  async getTeacherAssignments(teacherId: string): Promise<TeachingAssignment[]> {
    await new Promise((r) => setTimeout(r, 150));
    return mockBackend.getTeachingAssignments({ teacherId });
  },

  // Modul untuk Guru
  async getMyModules(teacherId: string, query?: { search?: string; status?: ModuleStatus }): Promise<ModuleItem[]> {
    await new Promise((r) => setTimeout(r, 200));
    let list = memoryModules.filter((m) => m.teacherId === teacherId);

    if (query?.status) {
      list = list.filter((m) => m.status === query.status);
    }
    if (query?.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }
    return list.map(enrichModule).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  // Modul untuk Admin
  async getAllModules(query?: { search?: string; status?: ModuleStatus; teacherId?: string; classId?: string; subjectId?: string }): Promise<ModuleItem[]> {
    await new Promise((r) => setTimeout(r, 200));
    let list = [...memoryModules];

    if (query?.status) {
      list = list.filter((m) => m.status === query.status);
    }
    if (query?.teacherId) {
      list = list.filter((m) => m.teacherId === query.teacherId);
    }
    if (query?.classId) {
      list = list.filter((m) => m.classId === query.classId);
    }
    if (query?.subjectId) {
      list = list.filter((m) => m.subjectId === query.subjectId);
    }
    if (query?.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }
    return list.map(enrichModule).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  // Ambil detail modul
  async getModuleById(moduleId: string): Promise<ModuleItem> {
    await new Promise((r) => setTimeout(r, 150));
    const target = memoryModules.find((m) => m.id === moduleId);
    if (!target) throw new Error('Modul pembelajaran tidak ditemukan.');
    return enrichModule(target);
  },

  // Buat modul baru
  async createModule(
    teacherId: string,
    input: {
      title: string;
      description?: string;
      learningObjectives: string;
      teachingAssignmentId: string;
      thumbnailUrl?: string;
    }
  ): Promise<ModuleItem> {
    await new Promise((r) => setTimeout(r, 300));
    const assignment = memoryTeachingAssignments.find((ta) => ta.id === input.teachingAssignmentId);
    if (!assignment) {
      throw new Error('Penugasan mengajar tidak ditemukan.');
    }
    if (assignment.teacherId !== teacherId) {
      throw new Error('Akses ditolak. Penugasan mengajar ini bukan milik Anda.');
    }

    const newModule: ModuleItem = {
      id: `mod-${Date.now().toString(36)}`,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      learningObjectives: input.learningObjectives.trim(),
      thumbnailUrl: input.thumbnailUrl || null,
      status: 'DRAFT',
      teacherId,
      teachingAssignmentId: assignment.id,
      classId: assignment.classId,
      subjectId: assignment.subjectId,
      academicYearId: assignment.academicYearId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: null,
    };

    memoryModules.push(newModule);
    return enrichModule(newModule);
  },

  // Edit modul
  async updateModule(
    moduleId: string,
    teacherId: string,
    input: {
      title?: string;
      description?: string;
      learningObjectives?: string;
      thumbnailUrl?: string;
    }
  ): Promise<{ module: ModuleItem; revertedToDraft: boolean }> {
    await new Promise((r) => setTimeout(r, 250));
    const idx = memoryModules.findIndex((m) => m.id === moduleId);
    if (idx === -1) throw new Error('Modul pembelajaran tidak ditemukan.');

    const target = memoryModules[idx];
    if (target.teacherId !== teacherId) {
      throw new Error('Akses ditolak. Anda bukan pemilik modul ini.');
    }

    const wasPublished = target.status === 'PUBLISHED';

    memoryModules[idx] = {
      ...target,
      ...(input.title ? { title: input.title.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.learningObjectives ? { learningObjectives: input.learningObjectives.trim() } : {}),
      ...(input.thumbnailUrl !== undefined ? { thumbnailUrl: input.thumbnailUrl || null } : {}),
      ...(wasPublished ? { status: 'DRAFT', publishedAt: null } : {}),
      updatedAt: new Date().toISOString(),
    };

    return {
      module: enrichModule(memoryModules[idx]),
      revertedToDraft: wasPublished,
    };
  },

  // Ubah status modul (Guru: DRAFT -> PENDING_REVIEW, Admin: PUBLISHED / DRAFT)
  async updateModuleStatus(
    moduleId: string,
    status: ModuleStatus,
    role: 'ADMIN' | 'TEACHER',
    teacherId?: string
  ): Promise<ModuleItem> {
    await new Promise((r) => setTimeout(r, 200));
    const idx = memoryModules.findIndex((m) => m.id === moduleId);
    if (idx === -1) throw new Error('Modul tidak ditemukan.');

    const target = memoryModules[idx];

    if (role === 'TEACHER') {
      if (target.teacherId !== teacherId) {
        throw new Error('Akses ditolak. Anda bukan pemilik modul ini.');
      }
      if (status === 'PUBLISHED') {
        throw new Error('Guru tidak dapat mempublikasikan modul langsung. Harap kirim ke Review Admin.');
      }
    }

    memoryModules[idx] = {
      ...target,
      status,
      publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : (status === 'DRAFT' ? null : target.publishedAt),
      updatedAt: new Date().toISOString(),
    };

    return enrichModule(memoryModules[idx]);
  },

  // Hapus modul
  async deleteModule(moduleId: string, teacherId?: string, isAdmin?: boolean): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    const target = memoryModules.find((m) => m.id === moduleId);
    if (!target) throw new Error('Modul tidak ditemukan.');

    if (!isAdmin && target.teacherId !== teacherId) {
      throw new Error('Akses ditolak. Anda tidak berwenang menghapus modul ini.');
    }

    memoryModules = memoryModules.filter((m) => m.id !== moduleId);
    memoryModuleContents = memoryModuleContents.filter((c) => c.moduleId !== moduleId);
    memoryModuleProgress = memoryModuleProgress.filter((p) => p.moduleId !== moduleId);
  },

  // Kelola Materi dalam Modul
  async getContents(moduleId: string): Promise<ModuleContent[]> {
    await new Promise((r) => setTimeout(r, 150));
    return memoryModuleContents
      .filter((c) => c.moduleId === moduleId)
      .sort((a, b) => a.orderNumber - b.orderNumber);
  },

  async createContent(
    moduleId: string,
    input: {
      title: string;
      description?: string;
      contentType: ContentType;
      textContent?: string;
      fileUrl?: string;
      videoUrl?: string;
      imageUrl?: string;
    }
  ): Promise<ModuleContent> {
    await new Promise((r) => setTimeout(r, 250));
    const modIdx = memoryModules.findIndex((m) => m.id === moduleId);
    if (modIdx === -1) throw new Error('Modul tidak ditemukan.');

    const existing = memoryModuleContents.filter((c) => c.moduleId === moduleId);
    const maxOrder = existing.reduce((max, c) => Math.max(max, c.orderNumber), 0);

    const newContent: ModuleContent = {
      id: `mc-${Date.now().toString(36)}`,
      moduleId,
      title: input.title.trim(),
      description: input.description?.trim() || null,
      contentType: input.contentType,
      textContent: input.contentType === 'TEXT' ? input.textContent || '' : null,
      fileUrl: input.contentType === 'DOCUMENT' ? input.fileUrl || '' : null,
      videoUrl: input.contentType === 'VIDEO' ? input.videoUrl || '' : null,
      imageUrl: input.contentType === 'IMAGE' ? input.imageUrl || '' : null,
      orderNumber: maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryModuleContents.push(newContent);

    // If module was PUBLISHED, revert to DRAFT
    if (memoryModules[modIdx].status === 'PUBLISHED') {
      memoryModules[modIdx].status = 'DRAFT';
      memoryModules[modIdx].publishedAt = null;
    }

    return newContent;
  },

  async updateContent(
    contentId: string,
    input: {
      title?: string;
      description?: string;
      contentType?: ContentType;
      textContent?: string;
      fileUrl?: string;
      videoUrl?: string;
      imageUrl?: string;
    }
  ): Promise<ModuleContent> {
    await new Promise((r) => setTimeout(r, 200));
    const idx = memoryModuleContents.findIndex((c) => c.id === contentId);
    if (idx === -1) throw new Error('Materi tidak ditemukan.');

    const old = memoryModuleContents[idx];
    const updated: ModuleContent = {
      ...old,
      ...(input.title ? { title: input.title.trim() } : {}),
      ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
      ...(input.contentType ? { contentType: input.contentType } : {}),
      ...(input.textContent !== undefined ? { textContent: input.textContent } : {}),
      ...(input.fileUrl !== undefined ? { fileUrl: input.fileUrl } : {}),
      ...(input.videoUrl !== undefined ? { videoUrl: input.videoUrl } : {}),
      ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
      updatedAt: new Date().toISOString(),
    };

    memoryModuleContents[idx] = updated;

    // If module was PUBLISHED, revert to DRAFT
    const modIdx = memoryModules.findIndex((m) => m.id === old.moduleId);
    if (modIdx !== -1 && memoryModules[modIdx].status === 'PUBLISHED') {
      memoryModules[modIdx].status = 'DRAFT';
      memoryModules[modIdx].publishedAt = null;
    }

    return updated;
  },

  async deleteContent(contentId: string): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    const target = memoryModuleContents.find((c) => c.id === contentId);
    if (!target) throw new Error('Materi tidak ditemukan.');

    const moduleId = target.moduleId;
    memoryModuleContents = memoryModuleContents.filter((c) => c.id !== contentId);
    memoryModuleProgress = memoryModuleProgress.filter((p) => p.moduleContentId !== contentId);

    // Re-sequence orderNumber
    const remaining = memoryModuleContents
      .filter((c) => c.moduleId === moduleId)
      .sort((a, b) => a.orderNumber - b.orderNumber);

    remaining.forEach((c, idx) => {
      c.orderNumber = idx + 1;
    });
  },

  async reorderContents(moduleId: string, contentIds: string[]): Promise<ModuleContent[]> {
    await new Promise((r) => setTimeout(r, 200));
    contentIds.forEach((id, idx) => {
      const item = memoryModuleContents.find((c) => c.id === id && c.moduleId === moduleId);
      if (item) {
        item.orderNumber = idx + 1;
      }
    });

    return memoryModuleContents
      .filter((c) => c.moduleId === moduleId)
      .sort((a, b) => a.orderNumber - b.orderNumber);
  },

  // Modul untuk Siswa
  async getStudentModules(studentId: string, query?: { search?: string }): Promise<ModuleItem[]> {
    await new Promise((r) => setTimeout(r, 250));
    // Find student classes
    const studentClasses = memoryClassStudents.filter((cs) => cs.studentId === studentId);
    const classIds = studentClasses.map((cs) => cs.classId);

    // Only PUBLISHED modules in student's class
    let list = memoryModules.filter((m) => m.status === 'PUBLISHED' && classIds.includes(m.classId));

    if (query?.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q))
      );
    }

    return list.map((m) => {
      const enriched = enrichModule(m);
      const contents = enriched.contents || [];
      const totalContents = contents.length;
      const completedContents = memoryModuleProgress.filter(
        (p) => p.studentId === studentId && p.moduleId === m.id && p.isCompleted
      ).length;
      const percentage = totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0;

      return {
        ...enriched,
        totalContents,
        completedContents,
        percentage,
      };
    });
  },

  async getStudentModuleDetail(studentId: string, moduleId: string): Promise<ModuleItem> {
    await new Promise((r) => setTimeout(r, 200));
    const target = memoryModules.find((m) => m.id === moduleId);
    if (!target) throw new Error('Modul pembelajaran tidak ditemukan.');
    if (target.status !== 'PUBLISHED') throw new Error('Modul ini belum dipublikasikan.');

    const enriched = enrichModule(target);
    const userProgress = memoryModuleProgress.filter(
      (p) => p.studentId === studentId && p.moduleId === moduleId
    );

    const contentsWithProgress = (enriched.contents || []).map((c) => {
      const prog = userProgress.find((p) => p.moduleContentId === c.id);
      return {
        ...c,
        isCompleted: prog ? prog.isCompleted : false,
        completedAt: prog ? prog.completedAt : null,
      };
    });

    const totalContents = contentsWithProgress.length;
    const completedContents = contentsWithProgress.filter((c) => c.isCompleted).length;
    const percentage = totalContents > 0 ? Math.round((completedContents / totalContents) * 100) : 0;

    return {
      ...enriched,
      contents: contentsWithProgress,
      totalContents,
      completedContents,
      percentage,
    };
  },

  async toggleContentProgress(
    studentId: string,
    moduleId: string,
    contentId: string,
    isCompleted: boolean
  ): Promise<{ isCompleted: boolean; completedAt: string | null; stats: { total: number; completed: number; percentage: number } }> {
    await new Promise((r) => setTimeout(r, 150));
    const existingIdx = memoryModuleProgress.findIndex(
      (p) => p.studentId === studentId && p.moduleContentId === contentId
    );

    const completedAt = isCompleted ? new Date().toISOString() : null;

    if (existingIdx !== -1) {
      memoryModuleProgress[existingIdx].isCompleted = isCompleted;
      memoryModuleProgress[existingIdx].completedAt = completedAt;
    } else if (isCompleted) {
      memoryModuleProgress.push({
        id: `mp-${Date.now().toString(36)}`,
        studentId,
        moduleId,
        moduleContentId: contentId,
        isCompleted: true,
        completedAt,
      });
    }

    const contents = memoryModuleContents.filter((c) => c.moduleId === moduleId);
    const total = contents.length;
    const completed = memoryModuleProgress.filter(
      (p) => p.studentId === studentId && p.moduleId === moduleId && p.isCompleted
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      isCompleted,
      completedAt,
      stats: { total, completed, percentage },
    };
  },
};

