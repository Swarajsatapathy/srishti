import multer from 'multer';
import ApiError from '../utils/ApiError.js';

// In-memory storage (good for Lambda — no filesystem writes)
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  // Images
  const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  // Videos
  const videoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];

  if ([...imageTypes, ...videoTypes].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, `Unsupported file type: ${file.mimetype}`), false);
  }
};

// For articles — multiple image uploads
export const uploadArticleImages = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per image
}).array('images', 10); // max 10 images

// For videos — one video + one thumbnail
export const uploadVideoFiles = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB for video
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]);

// For reporters — single photo upload
export const uploadReporterPhoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per photo
}).single('photo');

// For advertisements — multiple images + multiple videos
export const uploadAdMedia = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB per file
}).fields([
  { name: 'images', maxCount: 5 },
  { name: 'videos', maxCount: 3 },
]);
