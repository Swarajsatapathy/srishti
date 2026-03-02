import { Router } from 'express';
import {
  createReporter,
  getReporters,
  getReporterById,
  updateReporter,
  deleteReporter,
} from '../controllers/reporterController.js';
import { uploadReporterPhoto } from '../middlewares/upload.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

// CRUD
router.post('/', authMiddleware, uploadReporterPhoto, createReporter);
router.get('/', getReporters);
router.get('/:id', getReporterById);
router.put('/:id', authMiddleware, uploadReporterPhoto, updateReporter);
router.delete('/:id', authMiddleware, deleteReporter);

export default router;
