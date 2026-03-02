import { Router } from 'express';
import { login, getMe, changePassword } from '../controllers/authController.js';
import authMiddleware from '../middlewares/auth.js';

const router = Router();

// Public
router.post('/login', login);

// Protected
router.get('/me', authMiddleware, getMe);
router.put('/change-password', authMiddleware, changePassword);

export default router;
