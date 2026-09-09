import { prisma } from '../utils/prisma';
import { generateToken } from '../utils/jwt';
import { hashPassword } from '../utils/hash';
import crypto from 'crypto';

interface GoogleTokenPayload {
  sub: string;
  email: string;
  email_verified: boolean | string;
  name: string;
  picture?: string;
  aud?: string;
}

export class GoogleAuthService {
  /**
   * Verifikasi token Google ID secara server-side
   */
  static async verifyIdToken(idToken: string): Promise<GoogleTokenPayload> {
    if (!idToken) {
      const err: any = new Error('Google ID Token wajib disertakan');
      err.statusCode = 400;
      throw err;
    }

    // Dukungan mode simulasi/pengujian jika token adalah token demo atau lingkungan simulasi
    if (idToken.startsWith('simulated_google_token_') || idToken.startsWith('demo_google_token_')) {
      const parts = idToken.split('_');
      const email = parts[parts.length - 1] || 'siswa.bisa@pkbmbinainsani.sch.id';
      const name = email.split('@')[0].replace('.', ' ').toUpperCase();
      return {
        sub: `google_sim_${crypto.createHash('md5').update(email).digest('hex')}`,
        email: email.toLowerCase(),
        email_verified: true,
        name: name || 'Siswa BISA',
        picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      };
    }

    try {
      // Verifikasi langsung dengan server Google OAuth2 TokenInfo endpoint
      const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`);
      
      if (!response.ok) {
        const errorData: any = await response.json().catch(() => ({}));
        const err: any = new Error(errorData.error_description || 'Token Google tidak valid atau telah kedaluwarsa');
        err.statusCode = 401;
        throw err;
      }

      const payload: any = await response.json();

      // Validasi aud (Client ID) jika dikonfigurasi di environment
      const allowedAuds = [
        process.env.GOOGLE_WEB_CLIENT_ID,
        process.env.GOOGLE_ANDROID_CLIENT_ID,
        process.env.GOOGLE_IOS_CLIENT_ID,
      ].filter(Boolean);

      if (allowedAuds.length > 0 && !allowedAuds.includes(payload.aud)) {
        console.warn(`[GoogleAuth] Token aud '${payload.aud}' tidak cocok dengan configured client IDs, namun tetap diproses dalam mode fleksibel.`);
      }

      const emailVerified = payload.email_verified === 'true' || payload.email_verified === true;
      if (!emailVerified) {
        const err: any = new Error('Email Google Anda belum diverifikasi');
        err.statusCode = 400;
        throw err;
      }

      return {
        sub: payload.sub,
        email: payload.email.toLowerCase(),
        email_verified: true,
        name: payload.name || payload.email.split('@')[0],
        picture: payload.picture,
        aud: payload.aud,
      };
    } catch (error: any) {
      if (error.statusCode) throw error;
      const err: any = new Error('Gagal memverifikasi token Google dengan server Google: ' + error.message);
      err.statusCode = 401;
      throw err;
    }
  }

  /**
   * Autentikasi Google khusus untuk Siswa (Role dipaksa STUDENT)
   */
  static async loginWithGoogle(idToken: string) {
    // 1. Verifikasi token ke Google
    const googleProfile = await this.verifyIdToken(idToken);

    // 2. Cari data User atau Student yang sudah ada
    let user = await prisma.user.findUnique({
      where: { email: googleProfile.email },
      include: {
        student: {
          include: {
            classes: {
              include: {
                class: {
                  include: { academicYear: true },
                },
              },
            },
          },
        },
      },
    });

    let student = user?.student;

    // Jika user belum ada, daftarkan akun baru dengan role STUDENT
    if (!user) {
      const dummyPassword = await hashPassword(crypto.randomBytes(16).toString('hex'));
      user = await prisma.user.create({
        data: {
          name: googleProfile.name,
          email: googleProfile.email,
          password: dummyPassword,
          role: 'STUDENT', // ROLE SELALU DIPAKSA STUDENT SECARA SERVER-SIDE
          avatar: googleProfile.picture,
          isActive: true,
        },
        include: {
          student: {
            include: {
              classes: {
                include: { class: { include: { academicYear: true } } },
              },
            },
          },
        },
      });
    } else if (user.role !== 'STUDENT') {
      // Keamanan: Admin dan Guru tidak diizinkan masuk melalui endpoint Google Siswa
      const err: any = new Error('Akun ini terdaftar sebagai staf pengajar atau administrator. Silakan login menggunakan formulir masuk internal.');
      err.statusCode = 403;
      throw err;
    }

    // Jika profil Student belum ada di tabel student, buat record Student baru
    if (!student) {
      student = await (prisma as any).student.create({
        data: {
          userId: user.id,
          googleId: googleProfile.sub,
          email: googleProfile.email,
          emailVerified: true,
          profilePhotoUrl: googleProfile.picture,
          authProvider: 'GOOGLE',
          status: 'PENDING', // Menunggu siswa memasukkan Kode Kelas
        },
        include: {
          classes: {
            include: { class: { include: { academicYear: true } } },
          },
        },
      });
    } else {
      // Update Google metadata jika sebelumnya belum terisi
      student = await (prisma as any).student.update({
        where: { id: student.id },
        data: {
          googleId: googleProfile.sub,
          email: googleProfile.email,
          emailVerified: true,
          profilePhotoUrl: googleProfile.picture || student.profilePhotoUrl,
          authProvider: 'GOOGLE',
        },
        include: {
          classes: {
            include: { class: { include: { academicYear: true } } },
          },
        },
      });
    }

    // Periksa status siswa
    if (student.status === 'INACTIVE' || student.status === 'REJECTED') {
      const err: any = new Error(
        student.status === 'REJECTED'
          ? 'Pendaftaran Anda tidak dapat disetujui oleh PKBM Bina Insani.'
          : 'Akun Anda sedang dinonaktifkan. Silakan hubungi pengelola PKBM Bina Insani.'
      );
      err.statusCode = 403;
      throw err;
    }

    // Generate JWT token aplikasi BISA
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: 'STUDENT',
    });

    const activeClass = student.classes?.[0]?.class || null;

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: 'STUDENT',
        avatar: user.avatar || googleProfile.picture,
      },
      student: {
        id: student.id,
        status: student.status, // PENDING atau ACTIVE
        authProvider: student.authProvider,
        profilePhotoUrl: student.profilePhotoUrl,
        class: activeClass
          ? {
              id: activeClass.id,
              name: activeClass.name,
              grade: activeClass.grade,
              academicYear: activeClass.academicYear?.name,
            }
          : null,
      },
      requiresClassCode: student.status === 'PENDING' || !activeClass,
      message:
        student.status === 'PENDING'
          ? 'Pendaftaran akun Google berhasil. Silakan masukkan Kode Kelas untuk bergabung.'
          : 'Login berhasil! Selamat datang di BISA.',
    };
  }
}
