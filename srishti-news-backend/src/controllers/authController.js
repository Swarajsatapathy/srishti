import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Returns JWT token on success.
 */
export const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, 'Username and password are required');
  }

  const admin = await Admin.findOne({ username: username.toLowerCase().trim() });

  if (!admin) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isMatch = await admin.comparePassword(password);

  if (!isMatch) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, 'Server configuration error');
  }

  const token = jwt.sign(
    { id: admin._id, username: admin.username },
    secret,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json(
    new ApiResponse(200, { token, username: admin.username }, 'Login successful')
  );
});

/**
 * GET /api/auth/me
 * Requires auth middleware. Returns current admin info.
 */
export const getMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select('-password');
  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }
  res.json(new ApiResponse(200, { username: admin.username }, 'OK'));
});

/**
 * PUT /api/auth/change-password
 * Requires auth middleware.
 * Body: { currentPassword, newPassword }
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required');
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  const admin = await Admin.findById(req.admin.id);
  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  admin.password = newPassword;
  await admin.save();

  res.json(new ApiResponse(200, null, 'Password changed successfully'));
});
