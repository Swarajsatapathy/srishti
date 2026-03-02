import { Router } from 'express';
import {
  createAdvertisement,
  getAdvertisements,
  getAdvertisementById,
  getActiveAds,
  trackAdClick,
  updateAdvertisement,
  deleteAdvertisement,
} from '../controllers/advertisementController.js';
import { uploadAdMedia } from '../middlewares/upload.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

// Public endpoint — for frontend to fetch active ads
router.get('/active', getActiveAds);

// Track ad click (public — called from frontend)
router.post('/:id/click', trackAdClick);

// CRUD (protected)
router.post('/', authMiddleware, uploadAdMedia, createAdvertisement);
router.get('/', getAdvertisements);
router.get('/:id', getAdvertisementById);
router.put('/:id', authMiddleware, uploadAdMedia, updateAdvertisement);
router.delete('/:id', authMiddleware, deleteAdvertisement);

export default router;
