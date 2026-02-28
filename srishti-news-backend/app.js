import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import articleRoutes from './src/routes/articleRoutes.js';
import videoRoutes from './src/routes/videoRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import { imageRouter } from './src/routes/uploadRoutes.js';
import reporterRoutes from './src/routes/reporterRoutes.js';
import advertisementRoutes from './src/routes/advertisementRoutes.js';
import errorHandler from './src/middlewares/errorHandler.js';

dotenv.config();

const app = express();

// ─── Global middleware ──────────────────────────────────────────
// CORS is handled at the Lambda handler level to avoid duplicate headers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Database connection ────────────────────────────────────────
connectDB();

// ─── Health check ───────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Srishti News Backend API is running 🚀',
    endpoints: {
      articles: '/api/articles',
      videos: '/api/videos',
      upload: '/api/upload',
      reporters: '/api/reporters',
      advertisements: '/api/advertisements',
      images: '/api/images',
    },
  });
});

// ─── API Routes ─────────────────────────────────────────────────
app.use('/api/articles', articleRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/images', imageRouter);
app.use('/api/reporters', reporterRoutes);
app.use('/api/advertisements', advertisementRoutes);

// ─── 404 handler ────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error handler ──────────────────────────────────────────────
app.use(errorHandler);

export default app;
