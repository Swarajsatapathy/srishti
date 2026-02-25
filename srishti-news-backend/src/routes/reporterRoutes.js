import { Router } from 'express';
import {
  createReporter,
  getReporters,
  getReporterById,
  updateReporter,
  deleteReporter,
} from '../controllers/reporterController.js';
import { uploadReporterPhoto } from '../middlewares/upload.js';

const router = Router();

// CRUD
router.post('/', uploadReporterPhoto, createReporter);
router.get('/', getReporters);
router.get('/:id', getReporterById);
router.put('/:id', uploadReporterPhoto, updateReporter);
router.delete('/:id', deleteReporter);

export default router;
