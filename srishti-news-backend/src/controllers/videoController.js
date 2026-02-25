import Video from '../models/Video.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3Upload.js';

// ─── CREATE VIDEO ───────────────────────────────────────────────
export const createVideo = asyncHandler(async (req, res) => {
  const { title, description, category, reporter, tags, duration, isPublished, isFeatured, isTrending } = req.body;

  let videoUrl = '';
  let videoKey = '';
  let thumbnailUrl = '';
  let thumbnailKey = '';

  // If a video file was uploaded via multipart form
  if (req.files) {
    if (req.files.video && req.files.video[0]) {
      const vFile = req.files.video[0];
      const result = await uploadToS3(vFile.buffer, vFile.mimetype, 'videos');
      videoUrl = result.url;
      videoKey = result.key;
    }
    if (req.files.thumbnail && req.files.thumbnail[0]) {
      const tFile = req.files.thumbnail[0];
      const result = await uploadToS3(tFile.buffer, tFile.mimetype, 'thumbnails');
      thumbnailUrl = result.url;
      thumbnailKey = result.key;
    }
  }

  // Allow passing videoUrl directly (e.g. YouTube embed)
  if (!videoUrl && req.body.videoUrl) {
    videoUrl = req.body.videoUrl;
  }

  if (!videoUrl) {
    throw new ApiError(400, 'Video file or videoUrl is required');
  }

  const video = await Video.create({
    title,
    description,
    videoUrl,
    videoKey,
    thumbnailUrl: thumbnailUrl || req.body.thumbnailUrl || '',
    thumbnailKey,
    duration: duration ? parseInt(duration, 10) : 0,
    category,
    reporter,
    tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
    isPublished: isPublished === 'true' || isPublished === true,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isTrending: isTrending === 'true' || isTrending === true,
    publishedAt: isPublished ? new Date() : undefined,
  });

  return res.status(201).json(new ApiResponse(201, video, 'Video created successfully'));
});

// ─── GET ALL VIDEOS (with pagination, filters) ─────────────────
export const getVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    reporter,
    tag,
    featured,
    trending,
    published,
    search,
    sortBy = 'publishedAt',
    order = 'desc',
  } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (reporter) filter.reporter = { $regex: reporter, $options: 'i' };
  if (tag) filter.tags = tag;
  if (featured === 'true') filter.isFeatured = true;
  if (trending === 'true') filter.isTrending = true;
  if (published !== undefined) filter.isPublished = published === 'true';
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const sortOrder = order === 'asc' ? 1 : -1;

  const [videos, total] = await Promise.all([
    Video.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Video.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      videos,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  );
});

// ─── GET SINGLE VIDEO ───────────────────────────────────────────
export const getVideoById = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw new ApiError(404, 'Video not found');

  video.views += 1;
  await video.save();

  return res.status(200).json(new ApiResponse(200, video));
});

// ─── UPDATE VIDEO ───────────────────────────────────────────────
export const updateVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw new ApiError(404, 'Video not found');

  const { title, description, category, reporter, tags, duration, isPublished, isFeatured, isTrending } = req.body;

  // Replace video file if uploaded
  if (req.files && req.files.video && req.files.video[0]) {
    await deleteFromS3(video.videoKey);
    const vFile = req.files.video[0];
    const result = await uploadToS3(vFile.buffer, vFile.mimetype, 'videos');
    video.videoUrl = result.url;
    video.videoKey = result.key;
  }

  // Replace thumbnail if uploaded
  if (req.files && req.files.thumbnail && req.files.thumbnail[0]) {
    await deleteFromS3(video.thumbnailKey);
    const tFile = req.files.thumbnail[0];
    const result = await uploadToS3(tFile.buffer, tFile.mimetype, 'thumbnails');
    video.thumbnailUrl = result.url;
    video.thumbnailKey = result.key;
  }

  if (title !== undefined) video.title = title;
  if (description !== undefined) video.description = description;
  if (category !== undefined) video.category = category;
  if (reporter !== undefined) video.reporter = reporter;
  if (duration !== undefined) video.duration = parseInt(duration, 10);
  if (tags !== undefined) video.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
  if (req.body.videoUrl && !req.files?.video) video.videoUrl = req.body.videoUrl;
  if (isPublished !== undefined) {
    video.isPublished = isPublished === 'true' || isPublished === true;
    if (video.isPublished && !video.publishedAt) video.publishedAt = new Date();
  }
  if (isFeatured !== undefined) video.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isTrending !== undefined) video.isTrending = isTrending === 'true' || isTrending === true;

  await video.save();

  return res.status(200).json(new ApiResponse(200, video, 'Video updated successfully'));
});

// ─── DELETE VIDEO ───────────────────────────────────────────────
export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) throw new ApiError(404, 'Video not found');

  await deleteFromS3(video.videoKey);
  await deleteFromS3(video.thumbnailKey);
  await video.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Video deleted successfully'));
});

// ─── GET FEATURED VIDEOS ────────────────────────────────────────
export const getFeaturedVideos = asyncHandler(async (_req, res) => {
  const videos = await Video.find({ isFeatured: true, isPublished: true })
    .sort({ publishedAt: -1 })
    .limit(10)
    .lean();

  return res.status(200).json(new ApiResponse(200, videos));
});

// ─── GET TRENDING VIDEOS ────────────────────────────────────────
export const getTrendingVideos = asyncHandler(async (_req, res) => {
  const videos = await Video.find({ isTrending: true, isPublished: true })
    .sort({ views: -1 })
    .limit(10)
    .lean();

  return res.status(200).json(new ApiResponse(200, videos));
});
