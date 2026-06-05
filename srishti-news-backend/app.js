import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import { getDbStatus } from './src/config/db.js';
import articleRoutes from './src/routes/articleRoutes.js';
import videoRoutes from './src/routes/videoRoutes.js';
import uploadRoutes from './src/routes/uploadRoutes.js';
import { imageRouter } from './src/routes/uploadRoutes.js';
import reporterRoutes from './src/routes/reporterRoutes.js';
import advertisementRoutes from './src/routes/advertisementRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import errorHandler from './src/middlewares/errorHandler.js';

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

connectDB();

app.get('/health', (_req, res) => {
  const db = getDbStatus();
  res.json({
    success: true,
    message: 'Srishti News Backend API is running 🚀',
    db,
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

app.use('/api', async (_req, res, next) => {
  const connected = await connectDB();

  if (connected) {
    return next();
  }

  const db = getDbStatus();

  return res.status(503).json({
    success: false,
    message: 'Database unavailable. Please try again shortly.',
    error: db.lastError || 'MongoDB connection is not ready',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/images', imageRouter);
app.use('/api/reporters', reporterRoutes);
app.use('/api/advertisements', advertisementRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use(errorHandler);

export default app;