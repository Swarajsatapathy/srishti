import { Router } from 'express';
import {
  generatePresignedUrl,
  getImage,
  getSignedImageUrl,
  listImages,
} from '../controllers/uploadController.js';

const router = Router();

router.post('/presigned-url', generatePresignedUrl);

export default router;

// ── Image-serving routes (mounted at /api/images) ──────────────
export const imageRouter = Router();

imageRouter.get('/signed', getSignedImageUrl);   // ?key=articles/abc.jpeg
imageRouter.get('/',       listImages);           // ?folder=articles&maxKeys=50
imageRouter.get('/:folder/:filename', getImage);  // /articles/abc.jpeg → raw image
