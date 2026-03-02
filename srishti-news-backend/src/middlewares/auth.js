import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';

/**
 * Middleware that verifies the JWT token from the Authorization header.
 * Attach to any route that should be admin-only.
 */
const authMiddleware = (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error('JWT_SECRET is not set in environment variables');
      throw new ApiError(500, 'Server configuration error');
    }

    const decoded = jwt.verify(token, secret);
    req.admin = decoded;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return next(error);
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired. Please login again.'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token.'));
    }
    next(new ApiError(401, 'Authentication failed.'));
  }
};

export default authMiddleware;
