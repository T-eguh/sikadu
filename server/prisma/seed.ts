import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for Sekolah Model...');

  // Clean existing data in order of foreign key constraints
  await (prisma as any).teachingAssignment?.deleteMany();
  await (prisma as any).classStudent?.deleteMany();
  await (prisma as any).class?.deleteMany();
  await (prisma as any).subject?.deleteMany();
  await (prisma as any).academicYear?.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.user.deleteMany();

  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('Admin123!', saltRounds);
  const teacherPassword = await bcrypt.hash('Guru123!', saltRounds);
  const studentPassword = await bcrypt.hash('Siswa123!', saltRounds);

  // 1. Create ADMIN
  const admin = await prisma.user.create({
    data: {
      name: 'Administrator Utama',
      email: 'admin@sekolahmodel.sch.id',
      password: adminPassword,
      role: Role.ADMIN,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      isActive: true,
    },
  });
  console.log(`✅ Admin created: ${admin.email}`);

  // 2. Create TEACHERS (2)
  const teacher1 = await prisma.user.create({
    data: {
      name: 'Budi Santoso, S.Pd.',
      email: 'guru.budi@sekolahmodel.sch.id',
      password: teacherPassword,
      role: Role.TEACHER,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      isActive: true,
      teacher: {
        create: {
          teacherNumber: '198501152010011001',
        },
      },
    },
  });

  const teacher2 = await prisma.user.create({
    data: {
      name: 'Siti Rahmawati, M.Pd.',
      email: 'guru.siti@sekolahmodel.sch.id',
      password: teacherPassword,
      role: Role.TEACHER,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      isActive: true,
      teacher: {
        create: {
          teacherNumber: '198803202012022002',
        },
      },
    },
  });
  console.log(`✅ Teachers created: ${teacher1.email}, ${teacher2.email}`);

  // 3. Create STUDENTS (5)
  const studentsData = [
    {
      name: 'Ahmad Fauzi',
      email: 'siswa.ahmad@sekolahmodel.sch.id',
      studentNumber: '24001',
      nisn: '0071234561',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    },
    {
      name: 'Dewi Lestari',
      email: 'siswa.dewi@sekolahmodel.sch.id',
      studentNumber: '24002',
      nisn: '0071234562',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    },
    {
      name: 'Reza Pratama',
      email: 'siswa.reza@sekolahmodel.sch.id',
      studentNumber: '24003',
      nisn: '0071234563',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    {
      name: 'Anisa Nurul',
      email: 'siswa.anisa@sekolahmodel.sch.id',
      studentNumber: '24004',
      nisn: '0071234564',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
    {
      name: 'Fajar Hidayat',
      email: 'siswa.fajar@sekolahmodel.sch.id',
      studentNumber: '24005',
      nisn: '0071234565',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    },
  ];

  const createdStudents = [];
  for (const s of studentsData) {
    const u = await prisma.user.create({
      data: {
        name: s.name,
        email: s.email,
        password: studentPassword,
        role: Role.STUDENT,
        avatar: s.avatar,
        isActive: true,
        student: {
          create: {
            studentNumber: s.studentNumber,
            nisn: s.nisn,
          },
        },
      },
      include: {
        student: true,
      },
    });
    if (u.student) createdStudents.push(u.student);
  }
  console.log(`✅ 5 Students created successfully.`);

  const t1 = await prisma.teacher.findUnique({ where: { userId: teacher1.id } });
  const t2 = await prisma.teacher.findUnique({ where: { userId: teacher2.id } });

  // 4. Create ACADEMIC YEAR (2026/2027) - 1 active
  const academicYear = await (prisma as any).academicYear.create({
    data: {
      name: '2026/2027',
      startDate: new Date('2026-07-01'),
      endDate: new Date('2027-06-30'),
      isActive: true,
    },
  });
  console.log(`✅ Active Academic Year created: ${academicYear.name}`);

  // 5. Create 5 SUBJECTS
  const subjectsData = [
    { name: 'Matematika', code: 'MTK', description: 'Mata pelajaran berhitung, aljabar, dan geometri' },
    { name: 'Bahasa Indonesia', code: 'BIN', description: 'Tata bahasa, sastra, dan kemampuan literasi' },
    { name: 'Bahasa Inggris', code: 'BIG', description: 'Kemampuan komunikasi berbahasa Inggris global' },
    { name: 'Ilmu Pengetahuan Alam', code: 'IPA', description: 'Fisika, Biologi, dan Kimia terpadu' },
    { name: 'Ilmu Pengetahuan Sosial', code: 'IPS', description: 'Geografi, Sejarah, Sosiologi, dan Ekonomi' },
  ];

  const createdSubjects = [];
  for (const subj of subjectsData) {
    const created = await (prisma as any).subject.create({
      data: {
        name: subj.name,
        code: subj.code,
        description: subj.description,
        isActive: true,
      },
    });
    createdSubjects.push(created);
  }
  console.log(`✅ ${createdSubjects.length} Subjects created successfully.`);

  // 6. Create 3 CLASSES (7A, 7B, 8A)
  const class7A = await (prisma as any).class.create({
    data: {
      name: '7A',
      grade: '7',
      academicYearId: academicYear.id,
      homeroomTeacherId: t1?.id,
      isActive: true,
    },
  });

  const class7B = await (prisma as any).class.create({
    data: {
      name: '7B',
      grade: '7',
      academicYearId: academicYear.id,
      homeroomTeacherId: t2?.id,
      isActive: true,
    },
  });

  const class8A = await (prisma as any).class.create({
    data: {
      name: '8A',
      grade: '8',
      academicYearId: academicYear.id,
      homeroomTeacherId: null,
      isActive: true,
    },
  });
  console.log(`✅ 3 Classes created (7A, 7B, 8A).`);

  // 7. Enroll Students into Classes (ClassStudent)
  // Ensure NO student is in two active classes in the same academic year!
  if (createdStudents.length >= 5) {
    // 7A gets students 0, 1, 2
    await (prisma as any).classStudent.createMany({
      data: [
        { classId: class7A.id, studentId: createdStudents[0].id },
        { classId: class7A.id, studentId: createdStudents[1].id },
        { classId: class7A.id, studentId: createdStudents[2].id },
      ],
    });

    // 7B gets student 3
    await (prisma as any).classStudent.create({
      data: { classId: class7B.id, studentId: createdStudents[3].id },
    });

    // 8A gets student 4
    await (prisma as any).classStudent.create({
      data: { classId: class8A.id, studentId: createdStudents[4].id },
    });
  }
  console.log(`✅ Students placed into classes without conflicts.`);

  // 8. Create TEACHING ASSIGNMENTS
  // Budi Santoso (t1): Matematika (MTK) in 7A and 7B
  // Siti Rahmawati (t2): Bahasa Indonesia (BIN) in 7A and IPA in 7B
  const mtk = createdSubjects.find((s) => s.code === 'MTK');
  const bin = createdSubjects.find((s) => s.code === 'BIN');
  const ipa = createdSubjects.find((s) => s.code === 'IPA');

  if (t1 && t2 && mtk && bin && ipa) {
    await (prisma as any).teachingAssignment.createMany({
      data: [
        {
          teacherId: t1.id,
          classId: class7A.id,
          subjectId: mtk.id,
          academicYearId: academicYear.id,
        },
        {
          teacherId: t1.id,
          classId: class7B.id,
          subjectId: mtk.id,
          academicYearId: academicYear.id,
        },
        {
          teacherId: t2.id,
          classId: class7A.id,
          subjectId: bin.id,
          academicYearId: academicYear.id,
        },
        {
          teacherId: t2.id,
          classId: class7B.id,
          subjectId: ipa.id,
          academicYearId: academicYear.id,
        },
      ],
    });
    console.log(`✅ Teaching assignments created successfully.`);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
