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

const router = Router();

// Public endpoint — for frontend to fetch active ads
router.get('/active', getActiveAds);

// Track ad click
router.post('/:id/click', trackAdClick);

// CRUD
router.post('/', uploadAdMedia, createAdvertisement);
router.get('/', getAdvertisements);
router.get('/:id', getAdvertisementById);
router.put('/:id', uploadAdMedia, updateAdvertisement);
router.delete('/:id', deleteAdvertisement);

export default router;
