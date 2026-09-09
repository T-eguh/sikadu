import { prisma } from '../utils/prisma';
import crypto from 'crypto';

export class InvitationCodeService {
  /**
   * Menghasilkan kode unik kelas yang sulit ditebak
   * Contoh format: BISA-7A-X9K2P
   */
  static generateRandomCode(classPrefix: string): string {
    const cleanPrefix = classPrefix.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'CLS';
    const randomBytes = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
    return `BISA-${cleanPrefix}-${randomBytes}`;
  }

  /**
   * Membuat kode kelas baru untuk kelas tertentu (Admin)
   */
  static async createInvitationCode(
    classId: string,
    adminUserId: string,
    options?: {
      maxUses?: number | null;
      expiresAt?: Date | null;
    }
  ) {
    const targetClass = await (prisma as any).class.findUnique({
      where: { id: classId },
      include: { academicYear: true },
    });

    if (!targetClass) {
      const err: any = new Error('Kelas tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }

    // Generate kode unik
    let code = this.generateRandomCode(targetClass.name);
    let attempts = 0;
    while (attempts < 5) {
      const existing = await (prisma as any).classInvitationCode.findUnique({
        where: { code },
      });
      if (!existing) break;
      code = this.generateRandomCode(targetClass.name);
      attempts++;
    }

    const invitation = await (prisma as any).classInvitationCode.create({
      data: {
        code,
        classId: targetClass.id,
        academicYearId: targetClass.academicYearId,
        isActive: true,
        maxUses: options?.maxUses ?? null,
        expiresAt: options?.expiresAt ?? null,
        createdByAdminId: adminUserId,
      },
      include: {
        class: {
          select: { id: true, name: true, grade: true },
        },
        academicYear: {
          select: { id: true, name: true },
        },
      },
    });

    return invitation;
  }

  /**
   * Mengambil semua kode undangan untuk kelas tertentu
   */
  static async getCodesByClass(classId: string) {
    const codes = await (prisma as any).classInvitationCode.findMany({
      where: { classId },
      orderBy: { createdAt: 'desc' },
      include: {
        class: {
          select: { id: true, name: true, grade: true },
        },
        academicYear: {
          select: { id: true, name: true },
        },
      },
    });
    return codes;
  }

  /**
   * Menonaktifkan kode kelas
   */
  static async deactivateCode(codeId: string) {
    const code = await (prisma as any).classInvitationCode.findUnique({
      where: { id: codeId },
    });

    if (!code) {
      const err: any = new Error('Kode kelas tidak ditemukan');
      err.statusCode = 404;
      throw err;
    }

    const updated = await (prisma as any).classInvitationCode.update({
      where: { id: codeId },
      data: { isActive: false },
    });

    return updated;
  }

  /**
   * Regenerate kode: nonaktifkan kode lama dan buat kode baru
   */
  static async regenerateCode(classId: string, oldCodeId: string, adminUserId: string) {
    // Nonaktifkan kode lama
    await (prisma as any).classInvitationCode.update({
      where: { id: oldCodeId },
      data: { isActive: false },
    });

    // Buat kode baru
    return await this.createInvitationCode(classId, adminUserId);
  }

  /**
   * Siswa memasukkan kode untuk bergabung ke kelas
   */
  static async joinClassByCode(userId: string, rawCode: string) {
    const formattedCode = rawCode.trim().toUpperCase();

    if (!formattedCode) {
      const err: any = new Error('Kode kelas wajib dimasukkan');
      err.statusCode = 400;
      throw err;
    }

    // 1. Cari data siswa berdasarkan userId pengguna yang sedang login
    const student = await (prisma as any).student.findFirst({
      where: {
        OR: [{ userId }, { email: (await prisma.user.findUnique({ where: { id: userId } }))?.email }],
      },
      include: {
        classes: {
          include: { class: true },
        },
      },
    });

    if (!student) {
      const err: any = new Error('Profil siswa tidak ditemukan. Silakan hubungi admin.');
      err.statusCode = 404;
      throw err;
    }

    // Cek status siswa
    if (student.status === 'INACTIVE' || student.status === 'REJECTED') {
      const err: any = new Error('Akun Anda tidak aktif atau ditolak. Silakan hubungi PKBM Bina Insani.');
      err.statusCode = 403;
      throw err;
    }

    // 2. Cari kode kelas
    const invitation = await (prisma as any).classInvitationCode.findUnique({
      where: { code: formattedCode },
      include: {
        class: true,
        academicYear: true,
      },
    });

    if (!invitation) {
      const err: any = new Error('Kode kelas tidak valid atau tidak ditemukan. Mohon periksa kembali.');
      err.statusCode = 404;
      throw err;
    }

    // 3. Validasi status aktif kode
    if (!invitation.isActive) {
      const err: any = new Error('Kode kelas ini sudah dinonaktifkan oleh administrator.');
      err.statusCode = 400;
      throw err;
    }

    // 4. Validasi masa berlaku (expiresAt)
    if (invitation.expiresAt && new Date() > new Date(invitation.expiresAt)) {
      const err: any = new Error('Masa berlaku kode kelas ini telah berakhir.');
      err.statusCode = 400;
      throw err;
    }

    // 5. Validasi batas kuota penggunaan (maxUses)
    if (invitation.maxUses !== null && invitation.usedCount >= invitation.maxUses) {
      const err: any = new Error('Kuota pendaftaran untuk kode kelas ini telah penuh.');
      err.statusCode = 400;
      throw err;
    }

    // 6. Validasi siswa tidak boleh terdaftar di 2 kelas dalam Tahun Ajaran yang sama
    const existingInAcademicYear = student.classes.find(
      (c: any) => c.class.academicYearId === invitation.academicYearId
    );

    if (existingInAcademicYear) {
      if (existingInAcademicYear.classId === invitation.classId) {
        const err: any = new Error(`Anda sudah terdaftar di kelas ${invitation.class.name}.`);
        err.statusCode = 400;
        throw err;
      }
      const err: any = new Error(
        `Anda sudah terdaftar di kelas ${existingInAcademicYear.class.name} pada Tahun Ajaran ${invitation.academicYear.name}. Siswa tidak dapat mendaftar di 2 kelas pada tahun ajaran yang sama.`
      );
      err.statusCode = 400;
      throw err;
    }

    // 7. Gunakan Prisma Transaction untuk konsistensi data dan proteksi race condition
    const result = await (prisma as any).$transaction(async (tx: any) => {
      // Masukkan siswa ke kelas
      const classStudent = await tx.classStudent.create({
        data: {
          classId: invitation.classId,
          studentId: student.id,
        },
      });

      // Increment usedCount
      await tx.classInvitationCode.update({
        where: { id: invitation.id },
        data: {
          usedCount: { increment: 1 },
        },
      });

      // Update status siswa menjadi ACTIVE
      const updatedStudent = await tx.student.update({
        where: { id: student.id },
        data: {
          status: 'ACTIVE',
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
      });

      return {
        classStudent,
        student: updatedStudent,
        class: invitation.class,
        academicYear: invitation.academicYear,
      };
    });

    return {
      message: `Selamat! Anda berhasil bergabung ke kelas ${invitation.class.name}`,
      class: {
        id: result.class.id,
        name: result.class.name,
        grade: result.class.grade,
      },
      academicYear: {
        id: result.academicYear.id,
        name: result.academicYear.name,
      },
      studentStatus: 'ACTIVE',
    };
  }
}
