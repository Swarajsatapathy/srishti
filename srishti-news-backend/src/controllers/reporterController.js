import Reporter from '../models/Reporter.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3Upload.js';

// ─── CREATE REPORTER ────────────────────────────────────────────
export const createReporter = asyncHandler(async (req, res) => {
  const { name, designation, message, district } = req.body;

  // Upload photo to S3 if present
  let photo = { url: '', key: '' };
  if (req.file) {
    const { url, key } = await uploadToS3(req.file.buffer, req.file.mimetype, 'reporters');
    photo = { url, key };
  }

  const reporter = await Reporter.create({
    name,
    designation,
    message: message || '',
    district: district || '',
    photo,
  });

  return res.status(201).json(new ApiResponse(201, reporter, 'Reporter created successfully'));
});

// ─── GET ALL REPORTERS (with pagination) ────────────────────────
export const getReporters = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { designation: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const sortOrder = order === 'asc' ? 1 : -1;

  const [reporters, total] = await Promise.all([
    Reporter.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Reporter.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      reporters,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  );
});

// ─── GET SINGLE REPORTER ────────────────────────────────────────
export const getReporterById = asyncHandler(async (req, res) => {
  const reporter = await Reporter.findById(req.params.id).lean();
  if (!reporter) throw new ApiError(404, 'Reporter not found');

  return res.status(200).json(new ApiResponse(200, reporter));
});

// ─── UPDATE REPORTER ────────────────────────────────────────────
export const updateReporter = asyncHandler(async (req, res) => {
  const reporter = await Reporter.findById(req.params.id);
  if (!reporter) throw new ApiError(404, 'Reporter not found');

  const { name, designation, message, district } = req.body;

  if (name !== undefined) reporter.name = name;
  if (designation !== undefined) reporter.designation = designation;
  if (message !== undefined) reporter.message = message;
  if (district !== undefined) reporter.district = district;

  // Replace photo if a new one is uploaded
  if (req.file) {
    // Delete the old photo from S3
    if (reporter.photo?.key) {
      await deleteFromS3(reporter.photo.key);
    }
    const { url, key } = await uploadToS3(req.file.buffer, req.file.mimetype, 'reporters');
    reporter.photo = { url, key };
  }

  await reporter.save();

  return res.status(200).json(new ApiResponse(200, reporter, 'Reporter updated successfully'));
});

// ─── DELETE REPORTER ────────────────────────────────────────────
export const deleteReporter = asyncHandler(async (req, res) => {
  const reporter = await Reporter.findById(req.params.id);
  if (!reporter) throw new ApiError(404, 'Reporter not found');

  // Delete photo from S3
  if (reporter.photo?.key) {
    await deleteFromS3(reporter.photo.key);
  }

  await reporter.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Reporter deleted successfully'));
});
