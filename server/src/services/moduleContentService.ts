import fs from 'fs';
import path from 'path';
import { prisma } from '../utils/prisma';
import { ContentType } from '../types';
import { getUploadsBaseDir } from '../middleware/uploadMiddleware';

export class ModuleContentService {
  /**
   * Helper: Memvalidasi bahwa konten memiliki data yang lengkap sesuai tipe
   */
  static validateContentPayload(contentType: ContentType, data: {
    textContent?: string;
    fileUrl?: string;
    videoUrl?: string;
    imageUrl?: string;
  }) {
    if (contentType === 'TEXT') {
      if (!data.textContent || data.textContent.trim() === '') {
        const error: any = new Error('Konten teks (textContent) wajib diisi untuk materi jenis TEXT.');
        error.statusCode = 400;
        throw error;
      }
    } else if (contentType === 'DOCUMENT') {
      if (!data.fileUrl || data.fileUrl.trim() === '') {
        const error: any = new Error('URL berkas (fileUrl) wajib disertakan untuk materi jenis DOCUMENT.');
        error.statusCode = 400;
        throw error;
      }
    } else if (contentType === 'VIDEO') {
      if (!data.videoUrl || data.videoUrl.trim() === '') {
        const error: any = new Error('URL video (videoUrl) wajib disertakan untuk materi jenis VIDEO.');
        error.statusCode = 400;
        throw error;
      }
      try {
        new URL(data.videoUrl.trim());
      } catch {
        const error: any = new Error('Format videoUrl tidak valid. Harap masukkan tautan URL yang sah.');
        error.statusCode = 400;
        throw error;
      }
    } else if (contentType === 'IMAGE') {
      if (!data.imageUrl || data.imageUrl.trim() === '') {
        const error: any = new Error('URL gambar (imageUrl) wajib disertakan untuk materi jenis IMAGE.');
        error.statusCode = 400;
        throw error;
      }
    }
  }

  /**
   * Helper: Memverifikasi kepemilikan Modul untuk Guru
   */
  static async verifyModuleOwner(moduleId: string, user: { id: string; role: string }) {
    const foundModule = await (prisma as any).module.findUnique({
      where: { id: moduleId },
    });

    if (!foundModule) {
      const error: any = new Error('Modul pembelajaran tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    if (user.role === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({ where: { userId: user.id } });
      if (!teacher || teacher.id !== foundModule.teacherId) {
        const error: any = new Error('Akses ditolak. Anda bukan pemilik modul ini.');
        error.statusCode = 403;
        throw error;
      }
    }

    return foundModule;
  }

  /**
   * Mengambil semua materi dalam satu Modul
   */
  static async getContentsByModuleId(moduleId: string, user: { id: string; role: string }) {
    await this.verifyModuleOwner(moduleId, user);

    const contents = await (prisma as any).moduleContent.findMany({
      where: { moduleId },
      orderBy: { orderNumber: 'asc' },
    });

    return contents;
  }

  /**
   * Menambahkan Materi baru ke Modul
   */
  static async createContent(
    moduleId: string,
    user: { id: string; role: string },
    input: {
      title: string;
      description?: string;
      contentType: ContentType;
      textContent?: string;
      fileUrl?: string;
      videoUrl?: string;
      imageUrl?: string;
      orderNumber?: number;
    }
  ) {
    const parentModule = await this.verifyModuleOwner(moduleId, user);

    // Validasi payload sesuai tipe
    this.validateContentPayload(input.contentType, input);

    // Hitung orderNumber otomatis jika tidak diberikan
    let orderNumber = input.orderNumber;
    if (orderNumber === undefined || orderNumber === null) {
      const lastContent = await (prisma as any).moduleContent.findFirst({
        where: { moduleId },
        orderBy: { orderNumber: 'desc' },
      });
      orderNumber = lastContent ? lastContent.orderNumber + 1 : 1;
    }

    const newContent = await (prisma as any).moduleContent.create({
      data: {
        moduleId,
        title: input.title.trim(),
        description: input.description?.trim() || null,
        contentType: input.contentType,
        textContent: input.contentType === 'TEXT' ? input.textContent?.trim() : null,
        fileUrl: input.contentType === 'DOCUMENT' ? input.fileUrl?.trim() : null,
        videoUrl: input.contentType === 'VIDEO' ? input.videoUrl?.trim() : null,
        imageUrl: input.contentType === 'IMAGE' ? input.imageUrl?.trim() : null,
        orderNumber,
      },
    });

    // Jika modul sebelumnya PUBLISHED dan guru mengedit/menambah materi, kembalikan status ke DRAFT
    if (user.role === 'TEACHER' && parentModule.status === 'PUBLISHED') {
      await (prisma as any).module.update({
        where: { id: moduleId },
        data: { status: 'DRAFT', publishedAt: null },
      });
    }

    return newContent;
  }

  /**
   * Memperbarui Materi Modul
   */
  static async updateContent(
    contentId: string,
    user: { id: string; role: string },
    input: {
      title?: string;
      description?: string;
      contentType?: ContentType;
      textContent?: string;
      fileUrl?: string;
      videoUrl?: string;
      imageUrl?: string;
      orderNumber?: number;
    }
  ) {
    const content = await (prisma as any).moduleContent.findUnique({
      where: { id: contentId },
      include: { module: true },
    });

    if (!content) {
      const error: any = new Error('Materi modul tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    await this.verifyModuleOwner(content.moduleId, user);

    const targetContentType = input.contentType || content.contentType;
    this.validateContentPayload(targetContentType, {
      textContent: input.textContent !== undefined ? input.textContent : content.textContent,
      fileUrl: input.fileUrl !== undefined ? input.fileUrl : content.fileUrl,
      videoUrl: input.videoUrl !== undefined ? input.videoUrl : content.videoUrl,
      imageUrl: input.imageUrl !== undefined ? input.imageUrl : content.imageUrl,
    });

    const updated = await (prisma as any).moduleContent.update({
      where: { id: contentId },
      data: {
        ...(input.title ? { title: input.title.trim() } : {}),
        ...(input.description !== undefined ? { description: input.description?.trim() || null } : {}),
        ...(input.contentType ? { contentType: input.contentType } : {}),
        ...(input.textContent !== undefined ? { textContent: input.textContent?.trim() || null } : {}),
        ...(input.fileUrl !== undefined ? { fileUrl: input.fileUrl?.trim() || null } : {}),
        ...(input.videoUrl !== undefined ? { videoUrl: input.videoUrl?.trim() || null } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl?.trim() || null } : {}),
        ...(input.orderNumber !== undefined ? { orderNumber: input.orderNumber } : {}),
      },
    });

    // Jika modul sebelumnya PUBLISHED dan guru mengedit materi, kembalikan status ke DRAFT
    if (user.role === 'TEACHER' && content.module.status === 'PUBLISHED') {
      await (prisma as any).module.update({
        where: { id: content.moduleId },
        data: { status: 'DRAFT', publishedAt: null },
      });
    }

    return updated;
  }

  /**
   * Menghapus Materi Modul dan file fisiknya jika ada
   */
  static async deleteContent(contentId: string, user: { id: string; role: string }) {
    const content = await (prisma as any).moduleContent.findUnique({
      where: { id: contentId },
      include: { module: true },
    });

    if (!content) {
      const error: any = new Error('Materi modul tidak ditemukan.');
      error.statusCode = 404;
      throw error;
    }

    await this.verifyModuleOwner(content.moduleId, user);

    // Hapus berkas lokal jika ada
    const fileToDelete = content.fileUrl || content.imageUrl;
    if (fileToDelete && fileToDelete.startsWith('/uploads/')) {
      try {
        const relativePart = fileToDelete.replace('/uploads/', '');
        const fullPath = path.join(getUploadsBaseDir(), relativePart);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (err) {
        console.warn('Gagal menghapus berkas lokal materi:', err);
      }
    }

    const moduleId = content.moduleId;

    // Hapus dari database (Prisma cascade akan menghapus ModuleProgress terkait)
    await (prisma as any).moduleContent.delete({
      where: { id: contentId },
    });

    // Susun ulang orderNumber konten yang tersisa agar tetap berurutan 1..N
    const remainingContents = await (prisma as any).moduleContent.findMany({
      where: { moduleId },
      orderBy: { orderNumber: 'asc' },
    });

    await prisma.$transaction(
      remainingContents.map((item: any, idx: number) =>
        (prisma as any).moduleContent.update({
          where: { id: item.id },
          data: { orderNumber: idx + 1 },
        })
      )
    );

    return { message: 'Materi modul berhasil dihapus.' };
  }

  /**
   * Mengatur ulang urutan Materi Modul secara aman
   */
  static async reorderContents(
    moduleId: string,
    user: { id: string; role: string },
    contentIds: string[]
  ) {
    await this.verifyModuleOwner(moduleId, user);

    if (!Array.isArray(contentIds) || contentIds.length === 0) {
      const error: any = new Error('Daftar ID materi wajib disertakan untuk pengurutan.');
      error.statusCode = 400;
      throw error;
    }

    // Pastikan semua id benar-benar milik modul ini
    const existing = await (prisma as any).moduleContent.findMany({
      where: { moduleId },
      select: { id: true },
    });

    const existingIdSet = new Set(existing.map((e: any) => e.id));
    for (const cid of contentIds) {
      if (!existingIdSet.has(cid)) {
        const error: any = new Error(`Materi dengan ID ${cid} tidak ditemukan dalam modul ini.`);
        error.statusCode = 400;
        throw error;
      }
    }

    // Update berurutan dalam transaksi
    await prisma.$transaction(
      contentIds.map((cid, index) =>
        (prisma as any).moduleContent.update({
          where: { id: cid },
          data: { orderNumber: index + 1 },
        })
      )
    );

    const reordered = await (prisma as any).moduleContent.findMany({
      where: { moduleId },
      orderBy: { orderNumber: 'asc' },
    });

    return reordered;
  }
}
