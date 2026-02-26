import Advertisement from '../models/Advertisement.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3Upload.js';

// ─── CREATE ADVERTISEMENT ───────────────────────────────────────
export const createAdvertisement = asyncHandler(async (req, res) => {
  const { title, description, link, placement, isActive, startDate, endDate } = req.body;

  const images = [];
  const videos = [];

  if (req.files) {
    // Handle image uploads
    if (req.files.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        const { url, key } = await uploadToS3(file.buffer, file.mimetype, 'advertisements/images');
        images.push({ url, key });
      }
    }

    // Handle video uploads
    if (req.files.videos && req.files.videos.length > 0) {
      for (const file of req.files.videos) {
        const { url, key } = await uploadToS3(file.buffer, file.mimetype, 'advertisements/videos');
        videos.push({ url, key });
      }
    }
  }

  const ad = await Advertisement.create({
    title,
    description: description || '',
    images,
    videos,
    link: link || '',
    placement: placement || 'homepage',
    isActive: isActive === 'true' || isActive === true,
    startDate: startDate || new Date(),
    endDate: endDate || undefined,
  });

  return res.status(201).json(new ApiResponse(201, ad, 'Advertisement created successfully'));
});

// ─── GET ALL ADVERTISEMENTS (with pagination, filters) ──────────
export const getAdvertisements = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    placement,
    active,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const filter = {};
  if (placement) filter.placement = placement;
  if (active !== undefined) filter.isActive = active === 'true';

  const pageNum = Math.max(1, parseInt(page, 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const sortOrder = order === 'asc' ? 1 : -1;

  const [advertisements, total] = await Promise.all([
    Advertisement.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Advertisement.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      advertisements,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  );
});

// ─── GET SINGLE ADVERTISEMENT ───────────────────────────────────
export const getAdvertisementById = asyncHandler(async (req, res) => {
  const ad = await Advertisement.findById(req.params.id);
  if (!ad) throw new ApiError(404, 'Advertisement not found');

  return res.status(200).json(new ApiResponse(200, ad));
});

// ─── GET ACTIVE ADS (for frontend display) ──────────────────────
export const getActiveAds = asyncHandler(async (req, res) => {
  const { placement } = req.query;

  const now = new Date();
  const filter = {
    isActive: true,
    startDate: { $lte: now },
    $or: [{ endDate: null }, { endDate: { $gte: now } }],
  };
  if (placement) filter.placement = placement;

  const ads = await Advertisement.find(filter)
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  return res.status(200).json(new ApiResponse(200, ads));
});

// ─── TRACK AD CLICK ─────────────────────────────────────────────
export const trackAdClick = asyncHandler(async (req, res) => {
  const ad = await Advertisement.findById(req.params.id);
  if (!ad) throw new ApiError(404, 'Advertisement not found');

  ad.clicks += 1;
  await ad.save();

  return res.status(200).json(new ApiResponse(200, { clicks: ad.clicks }));
});

// ─── UPDATE ADVERTISEMENT ───────────────────────────────────────
export const updateAdvertisement = asyncHandler(async (req, res) => {
  const ad = await Advertisement.findById(req.params.id);
  if (!ad) throw new ApiError(404, 'Advertisement not found');

  const { title, description, link, placement, isActive, startDate, endDate, removeImages, removeVideos } = req.body;

  // Remove specific images
  if (removeImages) {
    const keysToRemove = typeof removeImages === 'string' ? JSON.parse(removeImages) : removeImages;
    for (const key of keysToRemove) {
      await deleteFromS3(key);
      ad.images = ad.images.filter((img) => img.key !== key);
    }
  }

  // Remove specific videos
  if (removeVideos) {
    const keysToRemove = typeof removeVideos === 'string' ? JSON.parse(removeVideos) : removeVideos;
    for (const key of keysToRemove) {
      await deleteFromS3(key);
      ad.videos = ad.videos.filter((vid) => vid.key !== key);
    }
  }

  // Add new images
  if (req.files && req.files.images && req.files.images.length > 0) {
    for (const file of req.files.images) {
      const { url, key } = await uploadToS3(file.buffer, file.mimetype, 'advertisements/images');
      ad.images.push({ url, key });
    }
  }

  // Add new videos
  if (req.files && req.files.videos && req.files.videos.length > 0) {
    for (const file of req.files.videos) {
      const { url, key } = await uploadToS3(file.buffer, file.mimetype, 'advertisements/videos');
      ad.videos.push({ url, key });
    }
  }

  if (title !== undefined) ad.title = title;
  if (description !== undefined) ad.description = description;
  if (link !== undefined) ad.link = link;
  if (placement !== undefined) ad.placement = placement;
  if (isActive !== undefined) ad.isActive = isActive === 'true' || isActive === true;
  if (startDate !== undefined) ad.startDate = startDate;
  if (endDate !== undefined) ad.endDate = endDate;

  await ad.save();

  return res.status(200).json(new ApiResponse(200, ad, 'Advertisement updated successfully'));
});

// ─── DELETE ADVERTISEMENT ───────────────────────────────────────
export const deleteAdvertisement = asyncHandler(async (req, res) => {
  const ad = await Advertisement.findById(req.params.id);
  if (!ad) throw new ApiError(404, 'Advertisement not found');

  // Delete all images from S3
  for (const img of ad.images) {
    await deleteFromS3(img.key);
  }

  // Delete all videos from S3
  for (const vid of ad.videos) {
    await deleteFromS3(vid.key);
  }

  await ad.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Advertisement deleted successfully'));
});
