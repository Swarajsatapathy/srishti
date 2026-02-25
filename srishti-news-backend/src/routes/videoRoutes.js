import { Router } from 'express';
import {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  getFeaturedVideos,
  getTrendingVideos,
} from '../controllers/videoController.js';
import { uploadVideoFiles } from '../middlewares/upload.js';

const router = Router();

// Curated endpoints
router.get('/featured', getFeaturedVideos);
router.get('/trending', getTrendingVideos);

// CRUD
router.post('/', uploadVideoFiles, createVideo);
router.get('/', getVideos);
router.get('/:id', getVideoById);
router.put('/:id', uploadVideoFiles, updateVideo);
router.delete('/:id', deleteVideo);

export default router;
