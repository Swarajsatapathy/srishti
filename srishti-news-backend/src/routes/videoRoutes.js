import { Router } from 'express';
import {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getFeaturedVideos,
  getTrendingVideos,
  getFlashVideos,
  getEditorsPickVideos,
} from '../controllers/videoController.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

// Curated endpoints
router.get('/featured', getFeaturedVideos);
router.get('/trending', getTrendingVideos);
router.get('/flash', getFlashVideos);
router.get('/editors-picks', getEditorsPickVideos);

// CRUD
router.post('/', authMiddleware, createVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.put('/:id', authMiddleware, updateVideo);
router.delete('/:id', authMiddleware, deleteVideo);

export default router;
