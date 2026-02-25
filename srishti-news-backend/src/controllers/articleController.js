import Article from '../models/Article.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToS3, deleteFromS3 } from '../utils/s3Upload.js';

// ─── CREATE ARTICLE ─────────────────────────────────────────────
export const createArticle = asyncHandler(async (req, res) => {
  const { title, description, content, category, reporter, tags, isPublished, isFeatured, isFlash, isTrending, isEditorsPick } = req.body;

  // Upload images to S3 if present
  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const { url, key } = await uploadToS3(file.buffer, file.mimetype, 'articles');
      images.push({ url, key, caption: '' });
    }
  }

  const article = await Article.create({
    title,
    description,
    content: content || '',
    images,
    category,
    reporter,
    tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
    isPublished: isPublished === 'true' || isPublished === true,
    isFeatured: isFeatured === 'true' || isFeatured === true,
    isFlash: isFlash === 'true' || isFlash === true,
    isTrending: isTrending === 'true' || isTrending === true,
    isEditorsPick: isEditorsPick === 'true' || isEditorsPick === true,
    publishedAt: isPublished ? new Date() : undefined,
  });

  return res.status(201).json(new ApiResponse(201, article, 'Article created successfully'));
});

// ─── GET ALL ARTICLES (with pagination, filters) ────────────────
export const getArticles = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    category,
    reporter,
    tag,
    featured,
    trending,
    editorsPick,
    flash,
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
  if (editorsPick === 'true') filter.isEditorsPick = true;
  if (flash === 'true') filter.isFlash = true;
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

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Article.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      articles,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  );
});

// ─── GET SINGLE ARTICLE ─────────────────────────────────────────
export const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, 'Article not found');

  // Increment view count
  article.views += 1;
  await article.save();

  return res.status(200).json(new ApiResponse(200, article));
});

// ─── UPDATE ARTICLE ─────────────────────────────────────────────
export const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, 'Article not found');

  const { title, description, content, category, reporter, tags, isPublished, isFeatured, isFlash, isTrending, isEditorsPick, removeImages } = req.body;

  // Remove specific images
  if (removeImages) {
    const keysToRemove = typeof removeImages === 'string' ? JSON.parse(removeImages) : removeImages;
    for (const key of keysToRemove) {
      await deleteFromS3(key);
      article.images = article.images.filter((img) => img.key !== key);
    }
  }

  // Add new images
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const { url, key } = await uploadToS3(file.buffer, file.mimetype, 'articles');
      article.images.push({ url, key, caption: '' });
    }
  }

  if (title !== undefined) article.title = title;
  if (description !== undefined) article.description = description;
  if (content !== undefined) article.content = content;
  if (category !== undefined) article.category = category;
  if (reporter !== undefined) article.reporter = reporter;
  if (tags !== undefined) article.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
  if (isPublished !== undefined) {
    article.isPublished = isPublished === 'true' || isPublished === true;
    if (article.isPublished && !article.publishedAt) article.publishedAt = new Date();
  }
  if (isFeatured !== undefined) article.isFeatured = isFeatured === 'true' || isFeatured === true;
  if (isFlash !== undefined) article.isFlash = isFlash === 'true' || isFlash === true;
  if (isTrending !== undefined) article.isTrending = isTrending === 'true' || isTrending === true;
  if (isEditorsPick !== undefined) article.isEditorsPick = isEditorsPick === 'true' || isEditorsPick === true;

  await article.save();

  return res.status(200).json(new ApiResponse(200, article, 'Article updated successfully'));
});

// ─── DELETE ARTICLE ─────────────────────────────────────────────
export const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, 'Article not found');

  // Delete all images from S3
  for (const img of article.images) {
    await deleteFromS3(img.key);
  }

  await article.deleteOne();

  return res.status(200).json(new ApiResponse(200, null, 'Article deleted successfully'));
});

// ─── GET FLASH / BREAKING STORIES ──────────────────────────────
export const getFlashStories = asyncHandler(async (_req, res) => {
  const articles = await Article.find({ isFlash: true, isPublished: true })
    .sort({ publishedAt: -1 })
    .limit(10)
    .lean();

  return res.status(200).json(new ApiResponse(200, articles));
});

// ─── GET EDITORS PICKS ──────────────────────────────────────────
export const getEditorsPicks = asyncHandler(async (_req, res) => {
  const articles = await Article.find({ isEditorsPick: true, isPublished: true })
    .sort({ publishedAt: -1 })
    .limit(10)
    .lean();

  return res.status(200).json(new ApiResponse(200, articles));
});

// ─── GET TRENDING STORIES ───────────────────────────────────────
export const getTrendingStories = asyncHandler(async (_req, res) => {
  const articles = await Article.find({ isTrending: true, isPublished: true })
    .sort({ views: -1 })
    .limit(10)
    .lean();

  return res.status(200).json(new ApiResponse(200, articles));
});

// ─── GET MAIN / FEATURED STORIES ────────────────────────────────
export const getFeaturedStories = asyncHandler(async (_req, res) => {
  const articles = await Article.find({ isFeatured: true, isPublished: true })
    .sort({ publishedAt: -1 })
    .limit(5)
    .lean();

  return res.status(200).json(new ApiResponse(200, articles));
});
