import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Helper to determine uploads base directory whether CWD is / or /server
export const getUploadsBaseDir = (): string => {
  const localServerDir = path.resolve(process.cwd(), 'server', 'uploads');
  const directDir = path.resolve(process.cwd(), 'uploads');
  if (fs.existsSync(path.resolve(process.cwd(), 'server'))) {
    if (!fs.existsSync(localServerDir)) {
      fs.mkdirSync(localServerDir, { recursive: true });
    }
    return localServerDir;
  }
  if (!fs.existsSync(directDir)) {
    fs.mkdirSync(directDir, { recursive: true });
  }
  return directDir;
};

const documentsDir = path.join(getUploadsBaseDir(), 'modules', 'documents');
const imagesDir = path.join(getUploadsBaseDir(), 'modules', 'images');

if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
}
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Document Storage
const documentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, documentsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `doc-${cleanName}-${uniqueSuffix}${ext}`);
  },
});

// Image Storage
const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, imagesDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `img-${cleanName}-${uniqueSuffix}${ext}`);
  },
});

// Allowed document mimetypes & extensions
const allowedDocTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const allowedDocExts = ['.pdf', '.doc', '.docx'];

// Allowed image mimetypes & extensions
const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const allowedImageExts = ['.jpg', '.jpeg', '.png'];

const maxDocSize = process.env.MAX_DOCUMENT_SIZE
  ? parseInt(process.env.MAX_DOCUMENT_SIZE, 10)
  : 20 * 1024 * 1024; // 20MB default

const maxImageSize = process.env.MAX_IMAGE_SIZE
  ? parseInt(process.env.MAX_IMAGE_SIZE, 10)
  : 10 * 1024 * 1024; // 10MB default

export const uploadDocument = multer({
  storage: documentStorage,
  limits: { fileSize: maxDocSize },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedDocExts.includes(ext) && allowedDocTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error: any = new Error(
        'Tipe berkas tidak didukung. Hanya file PDF, DOC, atau DOCX yang diperbolehkan.'
      );
      error.statusCode = 415;
      cb(error);
    }
  },
});

export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: maxImageSize },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedImageExts.includes(ext) && allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error: any = new Error(
        'Format gambar tidak didukung. Hanya JPG, JPEG, atau PNG yang diperbolehkan.'
      );
      error.statusCode = 415;
      cb(error);
    }
  },
});
