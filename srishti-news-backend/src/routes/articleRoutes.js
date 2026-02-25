import { Router } from 'express';
import {
  createArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  getFlashStories,
  getEditorsPicks,
  getTrendingStories,
  getFeaturedStories,
} from '../controllers/articleController.js';
import { uploadArticleImages } from '../middlewares/upload.js';

const router = Router();

// Special curated endpoints (put BEFORE /:id so they don't clash)
router.get('/flash', getFlashStories);
router.get('/editors-picks', getEditorsPicks);
router.get('/trending', getTrendingStories);
router.get('/featured', getFeaturedStories);

// CRUD
router.post('/', uploadArticleImages, createArticle);
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.put('/:id', uploadArticleImages, updateArticle);
router.delete('/:id', deleteArticle);

export default router;
